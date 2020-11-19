# frozen_string_literal: true

require 'rom'

# Tasks relation handle task model
class Tasks < ROM::Relation[:sql]
    schema(infer: true)
end
