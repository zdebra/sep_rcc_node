# Software Requirements Spectification for Request Change Collector

Version 2  
Prepared by Zdeněk Brabec  
brabezd1@fel.cvut.cz  
9.1.2017  

# Table of Contents
1. [Introduction](#introduction)
2. [Overall Description](#overall)
3. [External Interface Requirements](#external)
4. [System Features](#system)
5. [Other Nonfunctional Requirements](#nonfunctional)
6. [Other Requirements](#other)
7. [AppendixA: Analysis Model ](#analysis)

# Revision History

| Name          | Date          | Reason for changes  | Version |
| --------------|--------------:| --------------------|--------:|
| Zdeněk Brabec | 21.11.2016    | Intial specification| 1       |
| Zdeněk Brabec | 9.1.2017      | Fixed specification | 2       |

#1. Introdcution <a name="introduction"></a>

## Purpose
The Request Change Collector is a web application for submitting a change requests 
for database of clients.  

## Product Scope
The product offers the ability to create a change requests for existing database layer of clients. The goal is to achieve 
it in the user friendly package so it will be easy to submit change requests. 

#2. Overall Description <a name="overall"></a>

## Product Perspective
The application is utilising API of a core application and will be a part of existing 
product portfolio. The product functionality depends on a functionality of the core 
application. The app will be using the API for listing all the clients, client’s 
detail and for submitting a new change request.

## Product Functions
Following diagrams sums up the customer’s functions.

## Customer functions
![alt text](./customer.png "Customer")

## System functions
![alt text](./system.png "System")

#3. External Interface Requirements <a name="external"></a>

#4. System Features <a name="system"></a>

#5. Other Nonfunctional Requirements <a name="nonfunctional"></a>

#6. Other Requirements <a name="other"></a>

#AppendixA: Analysis Model <a name="analysis"></a>