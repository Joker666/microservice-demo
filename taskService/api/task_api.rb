require_relative '../proto/task/task_services_pb'
require_relative '../proto/project/project_services_pb'
require_relative '../proto/user/user_services_pb'

# TaskApi handles task api requests
class TaskApi < DemoTask::TaskSvc::Service
    def initialize(db_container, project_svc_client, user_svc_client)
        @db_container = db_container
        @project_service = project_svc_client
        @user_service = user_svc_client
    end

    def create_task(create_task_req, _unused_call)
        get_project_req = DemoProject::GetProjectRequest.new(user_id: create_task_req.user_id,
                                                             project_id: create_task_req.project_id)
        project = @project_service.get_project(get_project_req)

        get_user_req = DemoUser::GetUserRequest.new(user_id: create_task_req.user_id)
        user = @user_service.get_user(get_user_req)
        assigned_user = user
        assigned_user_id = user.id
        if !create_task_req.assigned_user_id.nil? && !create_task_req.assigned_user_id.empty?
            get_assign_user_req = DemoUser::GetUserRequest.new(user_id: create_task_req.assigned_user_id)
            assigned_user = @user_service.get_user(get_assign_user_req)
            assigned_user_id = assigned_user.id
        end

        create_task = @db_container.relations[:tasks].command(:create)
        task = create_task.call(name: create_task_req.name,
                         user_id: user.id,
                         project_id: project.id,
                         tag_id: create_task_req.tag_id,
                         assigned_user_id: assigned_user_id,
                         created_at: Time.now,
                         updated_at: Time.now)

        DemoTask::TaskResponse.new(id: task[:id].to_s, name: task[:name], user_id: user.id,
                                   assigned_user_id: task[:assigned_user_id], project_id: task[:project_id],
                                   project: project, assigned_user: assigned_user)
    end

    def list_tasks(list_tasks_req, _unused_call)
        q = Hash.new
        unless list_tasks_req.assigned_user_id.empty?
            q[:assigned_user_id] = list_tasks_req.assigned_user_id
        end
        unless list_tasks_req.project_id.empty?
            q[:project_id] = list_tasks_req.project_id
        end
        unless list_tasks_req.tag_id.empty?
            q[:tag_id] = list_tasks_req.tag_id
        end
        tasks_relation = @db_container.relations[:tasks].where(q)

        task_resp = []
        tasks_relation.each do |task|
            t = DemoTask::TaskResponse.new(id: task[:id].to_s, name: task[:name],
                                           user_id: task[:user_id], project_id: task[:project_id],
                                           assigned_user_id: task[:assigned_user_id], tag_id: task[:tag_id])
            task_resp.append(t)
        end
        DemoTask::ListTaskResponse.new(tasks: task_resp)
    end
end