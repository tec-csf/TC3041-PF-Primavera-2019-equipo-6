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
				"RETURN n.id, n.text, n.created_at", id=id_).values()
app = Flask(__name__)

def getPostID(session, id_, query):
	return session.run(query, id=id_).values()

#************************************Posts endpoints ********************************
@app.route('/post/<string:id>', methods= ['GET'])
def get_post(id):
	with driver.session() as session:
		query = "MATCH (n:Post) WHERE id(n) = " + id + " RETURN n.id, n.text, n.created_at"
		result = getPostID(session,id, query)
	return jsonify({'id': result[0][0], 'text': result[0][1], 'created_at': result[0][2]})

@app.route('/posts/', methods= ['GET'])
def get_all_in_db(): #doesn't work yet. Must bring all of the home page posts. 

	nodeJSON = []
	with driver.session() as session:
		# Iterating over the resposes from the graph db
		result= getPosts(session,1)
		for i in range(0,2):
			temp = result[i]
			nodeJSON.append(jsonify({'id': temp[0], 'text': temp[1], 'created_at': temp[2]}))
	
	return jsonify(nodeJSON = nodeJSON)

@app.route('/posts/me/', methods= ['GET']) #doesn't work yet. Must bring all of my own posts
def get_all_me():

	nodeJSON = []
	with driver.session() as session:
		# Iterating over the resposes from the graph db
		# NOTE:Excluding the ROOT NODE from RETURN!!!!
		result= getPosts(session,1)
		for i in range(0,2):
			temp = result[i]
			nodeJSON.append(jsonify({'id': temp[0], 'text': temp[1], 'created_at': temp[2]}))
	
	return jsonify({'nodes':nodeJSON})


if __name__ == '__main__':
	app.run(debug=True)