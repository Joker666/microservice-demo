# frozen_string_literal: true
this_dir = __dir__
lib_dir = File.join(this_dir, 'proto')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require './proto/task/task_services_pb'

# APIServer handle task service
class APIServer < DemoTask::TaskSvc::Service
    def create_task(create_task_req, _unused_call)
        DemoTask::TaskResponse.new(name: "Hello #{create_task_req.name}")
    end
end

def main
    s = GRPC::RpcServer.new
    s.add_http2_port('0.0.0.0:50054', :this_port_is_insecure)
    s.handle(APIServer)
    # Runs the server with SIGHUP, SIGINT and SIGQUIT signal handlers to gracefully shutdown.
    # User could also choose to run server via call to run_till_terminated
    puts "Server started at 50054"
    s.run_till_terminated_or_interrupted([1, 'int', 'SIGQUIT'])
end

main
