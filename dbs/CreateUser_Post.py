import sys
from random import randint

f = open("PostsCSV.csv", "w")

f.write("id,text,created_at")
usernames= ["Pedro","Antonio","Gerardo", "Gabriel"]
mails = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"]
for i in range(0,25000):
	f.write(str(i) + "," + "TestingPost number " + str(i) + "," + str(randint(1,30)) + "/" + str(randint(1,12)) + "/" + str(randint(2000,2018))+"\n")
f.close()

f = open("UserCSV.csv", "w")

f.write("id,username,mail,password,name,location,description,verified,created_at,birthday,lang,profile_banner_url,profile_img_url")
for i in range(0,5000):
	rand =randint(0,3)
	f.write(str(i) + "," + usernames[rand] + str(i) + "," + usernames[rand] + str(i)+ "@" + mails[randint(0,3)] + "," + "password" + str(i) + "," + usernames[rand] + ",CDMX," + "description," + "Y," + str(randint(1,30)) + "/" + str(randint(1,12)) + "/" + str(randint(2000,2018)) + "," + str(randint(1,30)) + "/" + str(randint(1,12)) + "/" + str(randint(1960,2010))+",EN,profile_img_url,profile_banner_url\n")
f.close()
