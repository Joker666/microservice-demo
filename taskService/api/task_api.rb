require_relative '../proto/task/task_services_pb'
require_relative '../proto/project/project_services_pb'
require_relative '../proto/user/user_services_pb'

# TaskApi handles task api requests
class TaskApi < DemoTask::TaskSvc::Service
    def initialize(project_svc_client, user_svc_client)
        @project_service = project_svc_client
        @user_service = user_svc_client
    end

    def create_task(create_task_req, _unused_call)
        get_project_req = DemoProject::GetProjectRequest.new(user_id: create_task_req.user_id,
                                                             project_id: create_task_req.project_id)
        project = @project_service.get_project(get_project_req)

        get_user_req = DemoUser::GetUserRequest.new(user_id: create_task_req.user_id)
        user = @user_service.get_user(get_user_req)
        p user.id

        DemoTask::TaskResponse.new(name: "Hello #{project.name}")
    end
end