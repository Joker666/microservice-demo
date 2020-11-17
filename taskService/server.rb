# frozen_string_literal: true
this_dir = __dir__
lib_dir = File.join(this_dir, 'proto')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require 'logger'
require 'dotenv/load'
require './proto/task/task_services_pb'

@logger = Logger.new(STDOUT)

# APIServer handle task service
class APIServer < DemoTask::TaskSvc::Service
    def create_task(create_task_req, _unused_call)
        DemoTask::TaskResponse.new(name: "Hello #{create_task_req.name}")
    end
end

def main
    address = ENV['HOST'] + ':' + ENV['PORT']
    s = GRPC::RpcServer.new
    s.add_http2_port(address, :this_port_is_insecure)
    @logger.info("Server started at " + address)
    s.handle(APIServer)
    s.run_till_terminated_or_interrupted([1, 'int', 'SIGQUIT'])
end

main
