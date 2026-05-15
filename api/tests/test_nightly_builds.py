# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

from unittest import mock

import backend_common.auth


def _admin_user():
    return mock.patch(
        "shipit_api.admin.api.current_user",
        backend_common.auth.Auth0User("", {"email": "admin", "https://sso.mozilla.com/claim/groups": "releng"}),
    )


@mock.patch("shipit_api.admin.api._rebuild_product_details", lambda body: None)
def test_add_nightly_build_requires_permission(app):
    """Users without add_nightly_build/<product> scope cannot create entries."""
    with app.test_client() as client:
        response = client.post(
            "/nightly-builds",
            json={"product": "firefox", "channel": "nightly", "version": "140.0a1", "buildid": "20250101010110", "locales": ["af"]},
        )
        assert response.status_code == 401


@mock.patch("shipit_api.admin.api._rebuild_product_details", lambda body: None)
def test_add_and_list_nightly_builds(app, monkeypatch):
    # Grant the permission for this test.
    monkeypatch.setitem(
        app.app.config["AUTH0_AUTH_SCOPES"],
        "project:releng:services/shipit_api/add_nightly_build/firefox",
        "releng",
    )

    with _admin_user():
        with app.test_client() as client:
            response = client.post(
                "/nightly-builds",
                json={
                    "product": "firefox",
                    "channel": "nightly",
                    "version": "140.0a1",
                    "buildid": "20250101010110",
                    "locales": ["af", "de", "en-US"],
                },
            )
            assert response.status_code == 201
            created = response.json()
            assert created["product"] == "firefox"
            assert created["channel"] == "nightly"
            assert created["version"] == "140.0a1"
            assert created["buildid"] == "20250101010110"
            assert created["locales"] == ["af", "de", "en-US"]

            # Posting a duplicate (product, channel, version, buildid) -> 409.
            response = client.post(
                "/nightly-builds",
                json={
                    "product": "firefox",
                    "channel": "nightly",
                    "version": "140.0a1",
                    "buildid": "20250101010110",
                    "locales": ["af"],
                },
            )
            assert response.status_code == 409

    # Public listing endpoint requires no auth.
    with app.test_client() as client:
        response = client.get("/nightly-builds")
        assert response.status_code == 200
        builds = response.json()
        assert len(builds) == 1
        assert builds[0]["buildid"] == "20250101010110"

        response = client.get("/nightly-builds", query_string={"product": "thunderbird"})
        assert response.status_code == 200
        assert response.json() == []

        # Single-record fetch.
        response = client.get(f"/nightly-builds/{builds[0]['id']}")
        assert response.status_code == 200
        assert response.json()["buildid"] == "20250101010110"

        response = client.get("/nightly-builds/99999")
        assert response.status_code == 404
