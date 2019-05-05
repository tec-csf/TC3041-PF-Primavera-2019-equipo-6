from flask import Flask, jsonify, request, Blueprint, render_template
from neo4jrestclient import client
from neo4jrestclient.client import GraphDatabase
from neo4jrestclient.constants import RAW
from neo4jrestclient.client import Node 
from urlparse import urlparse
import re, json
from neo4j import GraphDatabase


uri = "bolt://localhost:7687" #Port of the database
username = "neo4j" #Username for the database
password = "querty" #Password for the database
driver = GraphDatabase.driver(uri, auth=(username, password))

def getPosts(session, id_):
	return session.run("MATCH (n:Post)"
				"RETURN id(n), n.text, n.created_at", id=id_).values()
app = Flask(__name__)

def getPostID(session, id_, query):
	return session.run(query, id=id_).values()

#************************************Posts endpoints ********************************

@app.route('/posts/', methods= ['GET']) #gets all posts available in database. Possible needs to be changed to get only those from people I follow
def get_all_in_db():
	with driver.session() as session:
		query = "MATCH (n:Post) return id(n) as NodeID, n.text as PostText, n.created_at as CreationDate"
		result = session.run(query, id=1).values()
		dictionaries = (dict() for  x in range(0,len(result)))
		i=0
		r = []
		for item in result:
			diction = dict()
			diction["id"] = item[0]
			diction["text"] = item[1]
			diction["created_at"] = item[2]
			r.append(diction)
			i=i+1
		#print(dictionaries)
		if len(r)>0: 
			return jsonify([
	    	{
	        	"id": item["id"],
	        	"text": item["text"],
	        	"created_at": item["created_at"]
	    	}
	    	for item in r
			])
		else:
			return jsonify({"error": 404})

		#return jsonify(jsonarr)


@app.route('/post/<string:id>', methods= ['GET']) #brings individual post id
def get_post(id):
	with driver.session() as session:
		try:
			val = int(id)
		except ValueError:
			return jsonify({"error": 103, "description": "Not a number"})
		else:
			query = "MATCH (n:Post) WHERE id(n) = " + id + " RETURN n.id, n.text, n.created_at"
			result = getPostID(session,id, query)
			if(len(result)>0):
				arr = {'id': result[0][0], 'text': result[0][1], 'created_at': result[0][2]}
				return jsonify(arr)
			else:
				return jsonify({"error": 404})

@app.route('/posts/me/', methods= ['GET']) #Gets all posts from user. Needs to be changed so query brings the relation
def get_all_me():
	with driver.session() as session:
			query = "MATCH (n:Post) return id(n) as NodeID, n.text as PostText, n.created_at as CreationDate"
			result = session.run(query, id=1).values()
			dictionaries = (dict() for  x in range(0,len(result)))
			i=0
			r = []
			for item in result:
				diction = dict()
				diction["id"] = item[0]
				diction["text"] = item[1]
				diction["created_at"] = item[2]
				r.append(diction)
				i=i+1
			#print(dictionaries)
			return jsonify([
	    	{
	        	"id": item["id"],
	        	"text": item["text"],
	        	"created_at": item["created_at"]
	    	}
	    	for item in r
			])

if __name__ == '__main__':
	app.run(debug=True)