from ftplib import FTP

ftp = FTP('test.rebex.net')
ftp.login(user='demo', passwd = 'password')


welcome = "ciao ciao ciao ProFTPD 1.2.3 ciao ciao ciao"

#get "ProFTPD x.x.x" from welcome message
_list = ftp.getwelcome().split(" ")
version = ""
for each in _list:
    print(each)
    if each == "ProFTPD":
        version = _list[_list.index(each) + 1]
        print(version)
        break


ftp.quit()