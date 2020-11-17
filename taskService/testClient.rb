this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(this_dir, 'proto')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require './proto/task/task_services_pb'

def main
    user = 'world'
    hostname = ARGV.size > 1 ?  ARGV[1] : '0.0.0.0:50053'
    stub = DemoTask::TaskSvc::Stub.new(hostname, :this_channel_is_insecure)
    begin
        message = stub.create_task(DemoTask::CreateTaskRequest.new(name: user)).name
        p "Greeting: #{message}"
    rescue GRPC::BadStatus => e
        abort "ERROR: #{e.message}"
    end
end

main
