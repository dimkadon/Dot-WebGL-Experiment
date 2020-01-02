#!C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python37_64\python.exe
import os
import sys
import json

# Read request content
content_length = int(os.environ["CONTENT_LENGTH"])
request_body = sys.stdin.read(content_length)
json_data = json.loads(request_body)

# Headers
TEST_HEADERS = ["type", "edge", "h",
                "r", "totalTime", "startPosition", "endPosition", "viewedOrder", "viewedTime"]
LOG80_HEADERS = ["viewedTime", "distance"]

# Check if parameters have been supplied
if 'turkID' in json_data:

    f = open('dot_volume_%s.txt' %
             (json_data['turkID']), 'w')
    f.write(" \t".join(TEST_HEADERS) + "\n")
    for row in json_data['data_content'][3:]:
        f.write("\t".join([str(row[str(c).rstrip()])
                           for c in TEST_HEADERS]) + "\n")
    f.close()
    f = open('dot_volume_80_%s.txt' %
             (json_data['turkID']), 'w')
    f.write(" \t".join(LOG80_HEADERS) + "\n")
    for row in json_data['log80']:
        f.write("\t".join([str(row[str(c).rstrip()])
                           for c in LOG80_HEADERS]) + "\n")
    f.close()

    result = {'success': 'true',
              'message': 'The command completed successfully', 'json': json_data}
else:
    result = {'success': 'false',
              'message': 'Invalid mTurk ID', 'json': json_data}

# print('Content-type: text/plain; charset=UTF-8\n\n')

print('Content-type: application/json; charset=UTF-8\n\n')
print(json.dumps(result))
