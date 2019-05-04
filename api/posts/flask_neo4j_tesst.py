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
#db = GraphDatabase("http://localhost:7687")
#nodes = getNodes(db);
#rels = getRels(db);
def getStudent(session, id_):
	session.run("MATCH (n:Alumno)"
				"RETURN n.Nombre, n.Edad", id=id_).values()
app = Flask(__name__)

@app.route('/multi/<int:num>', methods= ['GET'])
def get_multiply10(num):
	return jsonify({'result': num*10})
@app.route('/people/', methods= ['GET'])
def get_all_in_db():
	#q = "MATCH(n:Alumno) return n"
	#params = {}
	#querySquenceObject = db.query(q, params=params, returns=RAW)
	nodeJSON = []
	with driver.session() as session:
		# Iterating over the resposes from the graph db
		# NOTE:Excluding the ROOT NODE from RETURN!!!!
		result= getStudent(session,1)
		#n = result.pop()
		#data = result.get('Nombre')
		#name = result.get('Edad')
			#description = data.get('description')

			#self = n.get('self')
			#print self
			#self = urlparse(self)
			#uid = doRegEX(self)

		#nodeJSON.append(createNodeJSON(data, name))
	
	return jsonify({'hola': 10})#nodeJSON


if __name__ == '__main__':
	app.run(debug=True)