#!/usr/bin/env ruby

#-----------------------------------------------------------------------------#
#   cache.rb                                                                  #
#                                                                             #
#   Copyright (c) 2012, Rajiv Bakulesh Shah, original author.                 #
#                                                                             #
#       This file is free software; you can redistribute it and/or modify     #
#       it under the terms of the GNU General Public License as published     #
#       by the Free Software Foundation, either version 3 of the License,     #
#       or (at your option) any later version.                                #
#                                                                             #
#       This file is distributed in the hope that it will be useful, but      #
#       WITHOUT ANY WARRANTY; without even the implied warranty of            #
#       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU     #
#       General Public License for more details.                              #
#                                                                             #
#       You should have received a copy of the GNU General Public License     #
#       along with this file.  If not, see:                                   #
#           <http://www.gnu.org/licenses/>.                                   #
#-----------------------------------------------------------------------------#


require 'redis'


module Cache
  class << self
    def lookup(key)
      value = REDIS.get(key)
      return value unless value.nil?

      value = yield
      REDIS.set(key, value)
      value
    end
  end
end


if __FILE__ == $0
  redis = Redis.new
  redis.keys.each { |key| puts key }
end
