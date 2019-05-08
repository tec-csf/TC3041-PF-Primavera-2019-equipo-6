import sys
from random import randint

f = open("PostsCSV.csv", "w")

f.write("id,text,created_at\n")
usernames= ["Pedro","Antonio","Gerardo", "Gabriel"]
mails = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"]
for i in range(0,25000):
	f.write(str(i) + "," + "TestingPost number " + str(i) + "," + str(randint(1,30)) + "-" + str(randint(1,12)) + "-" + str(randint(2000,2018))+"\n")
f.close()

f = open("UserCSV.csv", "w")

f.write("id,username,mail,password,name,location,description,verified,created_at,birthday,lang,profile_banner_url,profile_img_url\n")
for i in range(0,5000):
	rand =randint(0,3)
	f.write(str(i) + "," + usernames[rand] + str(i) + "," + usernames[rand] + str(i)+ "@" + mails[randint(0,3)] + "," + "password" + str(i) + "," + usernames[rand] + ",CDMX," + "description," + "Y," + str(randint(1,30)) + "-" + str(randint(1,12)) + "-" + str(randint(2000,2018)) + "," + str(randint(1,30)) + "-" + str(randint(1,12)) + "-" + str(randint(1960,2010))+",EN,profile_img_url,profile_banner_url\n")
f.close()

f=open("FOLLOWSCSV.csv", "w")

f.write("from_user, to_user, date\n")
for i in range(0,1000):
	rand1=randint(0,5000) #for random users1
	rand2 = randint(0,5000)

	f.write(str(rand1) + "," + str(rand2) + "," + "2019-" + str(randint(1,12)) + "-" + str(randint(1,30)) + "\n")
f.close()

f = open("CREATEDCSV.csv", "w")

f.write("post_id,user_id,creation_date")
for i in range(0,1000):
	rand1 = randint(0,5000)
	rand2 = randint(0,25000)
	f.write(str(rand1) + "," + str(rand2) + "," + "2019-" + str(randint(1,12)) + "-" + str(randint(1,30)) + "\n")
f.close()


f = open("LIKESCSV.csv", "w")

f.write("user_id,post_id,like_date")
for i in range(0,1000):
	rand1 = randint(0,5000)
	rand2 = randint(0,25000)
	f.write(str(rand2) + "," + str(rand1) + "," + "2019-" + str(randint(1,12)) + "-" + str(randint(1,30)) + "\n")
f.close()
