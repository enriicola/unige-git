import yaml
import subprocess
import nvdlib
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfgen import canvas
import re
import socket
import requests
from ftplib import FTP

# variables for colors and text styles
BOLD = '\033[1m'
WHITE  = '\033[0m'
GREEN  = '\033[32m'
BLUE  = '\033[34m'
BIG_RED  = '\033[41m'
RED  = '\033[31m'
BIG_YELLOW  = '\033[43m'
YELLOW  = '\033[33m'
UNDERLINED  = '\033[4m'

# variables for PDF generation
width, height = A4
center_x = width / 2
center_y = height / 2

def generate_pdf(input='data', output="report.pdf", title="Automated Vulnerability Scanner Report"):
   with open(input, 'r') as file:
      text = file.read()

   c = canvas.Canvas(output, pagesize=letter)
   c.setFont("Helvetica-Bold", 24)
   c.setFillColorRGB(0, 0.5, 0)
   c.drawCentredString(center_x, 750, title)
   c.setFillColorRGB(0, 0, 0)
   c.setFont("Helvetica-Bold", 11)
   c.drawCentredString(center_x, 725, "Courtesy of: Enrico Pezzano (4825087)")

   y_position = 675
   counter = 0
   new_line = ""
   for line in text.split('\n'):
      counter += 1

      if line[0:5] == "Found": c.setFont("Helvetica-Bold", 12)

      if line == ":D": c.setFillColorRGB(0, 0.6, 0)

      if line == "LOW" or line == "MEDIUM" or line == "HIGH" or line == "CRITICAL": new_line = "Danger: "

      if line == "LOW": c.setFillColorRGB(0.6, 0.6, 0)
      elif line == "MEDIUM": c.setFillColorRGB(1, 0.5, 0)
      elif line == "HIGH": c.setFillColorRGB(1, 0, 0)
      elif line == "CRITICAL": c.setFillColorRGB(128,0,128)

      if re.match(r"\d{4}-\d{2}-\d{2}" , line): new_line = "Last Modified in "

      if line[0:4] == "http": new_line = "For more information see: "

      # if counter%6 == 5: new_line = "Status: " #TODO to check with 2+ services

      new_line += line

      c.drawString(60, y_position, new_line)

      # reset the color, font and prefix
      c.setFillColorRGB(0, 0, 0)
      c.setFont("Helvetica", 12)
      new_line = ""

      y_position -= 20
      if counter % 30 == 0:
         c.showPage()
         y_position = 700
         counter = 0
   c.save()

def scan_services(services):
   with open("data", 'w') as file:
      for service in services:
         print(f"\nScanning for CVEs of {service['service_type']} {service['version']}...📡")
         vulnerabilities = get_vulnerabilities(service)      

         n = len(vulnerabilities)
         vuln = "vulnerability" if n == 1 else "vulnerabilities"

         if n == 0: colour = GREEN
         else: colour = BOLD
         print(f"Found {colour}{n}{WHITE} {vuln} for {colour}{service['service_type']} {service['version']}{WHITE}")

         if services.index(service) == 0: head = ""
         else: head = "\n"

         file.write(f"{head}Found {n} {vuln} for {service['service_type']} {service['version']}")

         if n == 0: file.write("\n:D\n"); continue #continue to the next service
         

         for each in vulnerabilities:
            if each[1] == "CRITICAL": colour = BIG_RED
            elif each[1] == "HIGH": colour = RED
            elif each[1] == "MEDIUM": colour = BIG_YELLOW
            elif each[1] == "LOW": colour = YELLOW
            else: colour = WHITE

            file.write(f"\n{each[0]}\n{each[1]}\n{each[2]}\nStatus: {each[3]}\n{each[4]}\n")

            my_tabulation = " " * (len(each[0]) + 5)
            print(f'{colour}{each[0]}{WHITE} --> Last Modified in: {each[2]}')
            print(f'{my_tabulation}Status: {each[3]}')
            print(f'{my_tabulation}For more information see: {UNDERLINED}{each[4]}{WHITE}\n')

# return a list of lists of vulnerabilities for a given service
def get_vulnerabilities(service): 
   result = nvdlib.searchCVE(keywordSearch=f'{service["service_type"]} {service['version']}')

   if result is None: return None

   vulnerabilities = []

   for eachCVE in result:
      vulnerability = []
      vulnerability.insert(len(vulnerability), eachCVE.id)
      vulnerability.insert(len(vulnerability), eachCVE.score[2])
      vulnerability.insert(len(vulnerability), eachCVE.lastModified[0:10])
      vulnerability.insert(len(vulnerability), eachCVE.vulnStatus)
      vulnerability.insert(len(vulnerability), eachCVE.url)
      vulnerabilities.append(vulnerability)

   return vulnerabilities
  
def get_service_version(_type, url, port):
   try:
      if url == "http://localhost": full_url = f"{url}:{port}"
      else: full_url = f"{url}"

      return eval(f'get_{_type}_version'.lower())(full_url)

   except Exception as e:
      print("error in " + get_service_version.__name__ + ": " + str(e))
      exit(1)

def get_wordpress_version(url):
   try:
      version = None
      command = f"curl {url} | grep 'WordPress [0-9]' | grep -o '[0-9].[0-9].[0-9]'"
      process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
      if process.returncode == 0:
         version = process.stdout.strip()
         if version == None: raise Exception("No version found")
         return version
         # return "2.1.3" #debug
      else:
         raise Exception(version)
      
   except Exception as e:
      print("\nerror in " +  get_wordpress_version.__name__+ ": " + str(e))
      version_input = input("Enter WordPress version manually: ")
      return version_input

def get_mysql_version(url):
   try:
      version = None
      s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      host = url.split("//")[0] + url.split(":")[1]
      port = int(url.split(":")[2])
      s.connect( (host, port) )

      s.settimeout(5)

      packet = b"\x00"
      s.sendall(packet)

      response = s.recv(4096)

      version_start = response.find(b"\x0a") + 1
      version_end = response.find(b"\x00", version_start)
      version = response[version_start:version_end].decode("utf-8")

      if version == None: raise Exception("No version found")
      return version

   except Exception as e:
      print("\nerror in " +  get_mysql_version.__name__+ ": " + str(e))
      version_input = input("Enter MySQL version manually: ")
      return version_input

def get_apache_version(url):
   try:
      version = None
      response = requests.get(url)
      if response.status_code == 200:
         server_header = response.text.split("\n")[0]

         for line in response.text.split("\n"):
            if line.__contains__("Version"):
               version = line.split("Version ")[1].replace(re.search(r'</.*>', line).group(), "")
               break

         # if server_header:
         #    match = re.match(r'\d*\.\d*\.\d*', server_header)
         #    print(match)
         #    if match:
         #       version = match.group()

      if version == None: raise Exception("No version found")
      return version

   except Exception as e:
      print("\nerror in " +  get_apache_version.__name__+ ": " + str(e))
      version_input = input("Enter Apache version manually: ")
      return version_input

def get_ftp_version(url):
   try:
      ftp = FTP(url)
      ftp.login()
      message = ftp.getwelcome().split(" ")
      version = None
      for word in message:
         if word.__contains__("FTPD"):
            # get version via regex
            version = re.search(r'\d+\.\d+\.\d+', word).group()
      ftp.quit()

      if version == None: raise Exception("No version found")
      return version

   except Exception as e:
      print("\nerror in " +  get_ftp_version.__name__+ ": " + str(e))
      version_input = input("Enter FTP version manually: ")
      return version_input

def get_php_version(url):
   try:
      version = None
      command = f"curl -I {url} | grep 'X-Powered-By: PHP/[0-9]' | grep -o '[0-9*].[0-9*].[0-9*]'"
      process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
      if process.returncode == 0:
         version = process.stdout.strip()
         if version == None: raise Exception("No version found")
         return version
      else:
         raise Exception(version)
      
   except Exception as e:
      print("\nerror in " +  get_php_version.__name__+ ": " + str(e))
      version_input = input("Enter php version manually: ")
      return version_input

def ask_for_additional_(services):
   answer = input("\nDo you want to add other services? (y/n): ")
   if answer == "n": return
   if answer == "y":
      n = int(input("How many services do you want to add? "))
      if n < 0:
         raise Exception("Invalid number of services")
         exit(1)
      
      for i in range(n):
         service = {}
         service["service_type"] = input("Enter service type: ")
         service["version"] = input("Enter version: ")
         service["base_url"] = service["port"] = ""
         services.append(service)
         print()

def main():
   try:
      with open("input.yaml", "r") as file:
         services = yaml.safe_load(file)
         ip = services.pop(0) # TODO to connect to the IP address of a conteiner with the services
         # print(ip)
         for service in services:
            service["version"] = get_service_version(service["service_type"], service["base_url"], service["port"])

      ask_for_additional_(services)
      scan_services(services)
      generate_pdf()

   except Exception as e:
      print("error in " +  main.__name__+ ": " + str(e))
      exit(1)

if __name__ == "__main__":
   main()