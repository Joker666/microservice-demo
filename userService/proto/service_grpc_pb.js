// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var service_pb = require('./service_pb.js');

function serialize_demo_user_LoginRequest(arg) {
  if (!(arg instanceof service_pb.LoginRequest)) {
    throw new Error('Expected argument of type demo_user.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_user_LoginRequest(buffer_arg) {
  return service_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_user_RegisterRequest(arg) {
  if (!(arg instanceof service_pb.RegisterRequest)) {
    throw new Error('Expected argument of type demo_user.RegisterRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_user_RegisterRequest(buffer_arg) {
  return service_pb.RegisterRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_user_UserResponse(arg) {
  if (!(arg instanceof service_pb.UserResponse)) {
    throw new Error('Expected argument of type demo_user.UserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_user_UserResponse(buffer_arg) {
  return service_pb.UserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_user_VerifyRequest(arg) {
  if (!(arg instanceof service_pb.VerifyRequest)) {
    throw new Error('Expected argument of type demo_user.VerifyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_user_VerifyRequest(buffer_arg) {
  return service_pb.VerifyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_demo_user_VerifyResponse(arg) {
  if (!(arg instanceof service_pb.VerifyResponse)) {
    throw new Error('Expected argument of type demo_user.VerifyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_demo_user_VerifyResponse(buffer_arg) {
  return service_pb.VerifyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var UserSvcService = exports.UserSvcService = {
  register: {
    path: '/demo_user.UserSvc/register',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.RegisterRequest,
    responseType: service_pb.UserResponse,
    requestSerialize: serialize_demo_user_RegisterRequest,
    requestDeserialize: deserialize_demo_user_RegisterRequest,
    responseSerialize: serialize_demo_user_UserResponse,
    responseDeserialize: deserialize_demo_user_UserResponse,
  },
  login: {
    path: '/demo_user.UserSvc/login',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.LoginRequest,
    responseType: service_pb.UserResponse,
    requestSerialize: serialize_demo_user_LoginRequest,
    requestDeserialize: deserialize_demo_user_LoginRequest,
    responseSerialize: serialize_demo_user_UserResponse,
    responseDeserialize: deserialize_demo_user_UserResponse,
  },
  verify: {
    path: '/demo_user.UserSvc/verify',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.VerifyRequest,
    responseType: service_pb.VerifyResponse,
    requestSerialize: serialize_demo_user_VerifyRequest,
    requestDeserialize: deserialize_demo_user_VerifyRequest,
    responseSerialize: serialize_demo_user_VerifyResponse,
    responseDeserialize: deserialize_demo_user_VerifyResponse,
  },
};

exports.UserSvcClient = grpc.makeGenericClientConstructor(UserSvcService);
