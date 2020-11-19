# frozen_string_literal: true

ROM::SQL.migration do
    change do
        create_table :tasks do
            primary_key :id
            column :name, String, null: false
            column :project_id, String, null: false
            column :user_id, String, null: false
            column :assigned_user_id, String, null: false
            column :tag_id, String
            column :created_at, DateTime
            column :updated_at, DateTime
        end
    end
end
