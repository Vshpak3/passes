#!/usr/bin/env bash
#
# Local MySQL utilities. Supported commands:
#  connect:     opens up a mysql shell
#  enable_logs: enables general logs
#  logs:        prints out all logs
#  clear_logs:  clears general logs
#
set -o errexit
set -o nounset
set -o pipefail

readonly connect_command="mysql -u root -P 3306 -h 127.0.0.1 -p'root' passes"

readonly mysql_command_enable_logs="SET GLOBAL log_output = 'TABLE'; SET GLOBAL general_log = 'ON';"
readonly mysql_command_show_logs="SELECT gl.event_time as Time, CONVERT(gl.argument USING utf8) as Query FROM mysql.general_log AS gl WHERE gl.command_type = 'Query';"
readonly mysql_command_clear_logs="TRUNCATE TABLE mysql.general_log"

readonly option=${1:-}

case "${option}" in

  connect)
    eval "${connect_command}"
    ;;

  enable_logs)
    echo "Turning on MySQL general logs"
    eval "${connect_command} -e \"${mysql_command_enable_logs}\""
    ;;

  logs)
    eval "${connect_command} -e \"${mysql_command_show_logs}\"" | grep -v 'mysql.general_log'
    ;;

  clear_logs)
    eval "${connect_command} -e \"${mysql_command_clear_logs}\""
    ;;

  *)
    echo "Did not provide a supported option"
    exit 1
    ;;
esac

