#!/usr/bin/python3
import json
import subprocess

# from pathlib import Path
# from typing import Generator

for image in subprocess.check_output(['docker', 'image', 'ls', '--format=json']).splitlines():
    image = json.loads(image)
    if not image['Repository'].startswith('registry.vcc.internal'):
        continue
    if image['Tag'] == '<none>':
        subprocess.check_call(['docker','image','rm','-f',image['Repository']])
    else:
        name = image['Repository'] + ':' + image['Tag']
        subprocess.check_call(['docker','image','rm','-f',name])

# COMPOSE_FILES = []
# for file in Path('/opt').iterdir():
#     if file.is_file() and file.name.endswith(('.yml', '.yaml')):
#         COMPOSE_FILES.append(file)

# def get_images_for_compose_file(compose_file: Path) -> Generator[str, None, None]:
#     image_re = re.compile(r'\s+image:\s+(?P<image>\S+)\s*') # this is horrifying, but this planet is :), btw does not work if the image is between ' or "
#     with open(compose_file, 'r') as file:
#         for line in file:
#             image_match = image_re.match(line)
#             if image_match is not None:
#                 yield image_match.group('image')

# IMAGES = set()
# for compose_file in COMPOSE_FILES:
#     for image in get_images_for_compose_file(compose_file):
#         IMAGES.add(image)
# IMAGES = sorted(IMAGES)

# print('Pulling images', IMAGES)
# for image in IMAGES:
#     print('Pulling image', image)
#     subprocess.check_call([ 'docker', 'image', 'pull', image ])
#     print('Pulled image', image)
