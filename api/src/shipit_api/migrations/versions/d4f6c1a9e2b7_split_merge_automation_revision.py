"""Rename merge automation revision to decision_task_revision, add from/to revision

Revision ID: d4f6c1a9e2b7
Revises: c7e2a5f8b9d3
Create Date: 2026-07-20 00:00:00.000000

"""

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = "d4f6c1a9e2b7"
down_revision = "c7e2a5f8b9d3"
branch_labels = None
depends_on = None

TABLE = "shipit_api_merge_automation"


def upgrade():
    op.alter_column(TABLE, "revision", new_column_name="decision_task_revision")
    op.add_column(TABLE, sa.Column("from_revision", sa.String(), nullable=True))
    op.add_column(TABLE, sa.Column("to_revision", sa.String(), nullable=True))

    op.execute(
        f"""
        UPDATE {TABLE}
        SET from_revision = decision_task_revision
        WHERE behavior IN ('main-to-beta', 'beta-to-release')
        """
    )
    op.execute(
        f"""
        UPDATE {TABLE}
        SET to_revision = decision_task_revision
        WHERE behavior NOT IN ('main-to-beta', 'beta-to-release')
        """
    )


def downgrade():
    op.drop_column(TABLE, "to_revision")
    op.drop_column(TABLE, "from_revision")
    op.alter_column(TABLE, "decision_task_revision", new_column_name="revision")
