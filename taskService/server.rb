# frozen_string_literal: true
this_dir = __dir__
lib_dir = File.join(this_dir, 'proto')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'rom'
require 'grpc'
require 'logger'
require 'dotenv/load'
require_relative 'api/task_api'
require_relative 'proto/project/project_services_pb'
require_relative 'proto/user/user_services_pb'

configuration = ROM::Configuration.new(:sql, ENV['DB_URI'])
require_relative 'db/relations/tasks'
configuration.register_relation(Tasks)
DB_CONTAINER = ROM.container(configuration)

@logger = Logger.new(STDOUT)

def main
    address = ENV['HOST'] + ':' + ENV['PORT']
    s = GRPC::RpcServer.new
    s.add_http2_port(address, :this_port_is_insecure)
    @logger.info("Server started at " + address)

    project_address = ENV['PROJECT_ADDRESS']
    project_client = DemoProject::ProjectSvc::Stub.new(project_address, :this_channel_is_insecure)
    @logger.info("Project client connected at " + project_address)

    user_address = ENV['USER_ADDRESS']
    user_client = DemoUser::UserSvc::Stub.new(user_address, :this_channel_is_insecure)
    @logger.info("User client connected at " + user_address)

    s.handle(TaskApi.new(DB_CONTAINER, project_client, user_client))

    s.run_till_terminated_or_interrupted([1, 'int', 'SIGQUIT'])
end

main
