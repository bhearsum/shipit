"""Add release locales/build_id and nightly_builds tables

Revision ID: d4f1a2c3e5b7
Revises: bc175ac0c2c5
Create Date: 2026-05-14 11:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "d4f1a2c3e5b7"
down_revision = "bc175ac0c2c5"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("shipit_api_releases", sa.Column("build_id", sa.String(), nullable=True))

    op.create_table(
        "shipit_api_release_locales",
        sa.Column("release_id", sa.Integer(), nullable=False),
        sa.Column("locale", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["release_id"], ["shipit_api_releases.id"]),
        sa.PrimaryKeyConstraint("release_id", "locale"),
        if_not_exists=True,
    )

    op.create_table(
        "shipit_api_nightly_builds",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("product", sa.String(), nullable=False),
        sa.Column("channel", sa.String(), nullable=False),
        sa.Column("version", sa.String(), nullable=False),
        sa.Column("buildid", sa.String(), nullable=False),
        sa.Column("created", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("product", "channel", "version", "buildid", name="_nightly_product_channel_version_buildid_uc"),
        if_not_exists=True,
    )

    op.create_table(
        "shipit_api_nightly_build_locales",
        sa.Column("nightly_build_id", sa.Integer(), nullable=False),
        sa.Column("locale", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["nightly_build_id"], ["shipit_api_nightly_builds.id"]),
        sa.PrimaryKeyConstraint("nightly_build_id", "locale"),
        if_not_exists=True,
    )


def downgrade():
    op.drop_table("shipit_api_nightly_build_locales")
    op.drop_table("shipit_api_nightly_builds")
    op.drop_table("shipit_api_release_locales")
    op.drop_column("shipit_api_releases", "build_id")
