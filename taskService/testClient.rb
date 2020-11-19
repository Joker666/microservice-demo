this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(this_dir, 'proto')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require './proto/task/task_services_pb'
require './proto/project/project_services_pb'

def main
    user = 'world'
    hostname = ARGV.size > 1 ?  ARGV[1] : '0.0.0.0:50053'
    stub = DemoTask::TaskSvc::Stub.new(hostname, :this_channel_is_insecure)
    begin
        message = stub.create_task(DemoTask::CreateTaskRequest.new(name: user,
                                                                   user_id: '5fafcd09a257e20ad860a392',
                                                                   assigned_user_id: '5fafcd60c4bf735022f444a7',
                                                                   project_id: '6'))
        p message
    rescue GRPC::BadStatus => e
        abort "ERROR: #{e.message}"
    end
end

main
