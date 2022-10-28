# GETVAPP

NOTE: This app is private / personal use and shouldn't be used by anyone else

## How to use

Simply run `npx createvapp` in the desired directory

<br/>
<br/>

## Templates


NOTES:
-  All the templates have the basic folder: Manifest,messages,docs and public folder
- All React folders include typings,package.json, and tsconfig


|        NAME        	|   	|                                        DEFINITION                                        	|
|---------------------|-----|----------------------------------------------------------------------------------------	|
| Empty              	|   	|                                     Only basic folder                                    	|
| Store              	|   	| Store folder (interfaces.json) + React folder                                            	|
| My Account Plugin  	|   	| Store folder (interfaces + plugins.json) +  React folder (with my-account-plugin routes) 	|
| Pixel App          	|   	| Store folder (interfaces + plugins.json) + Pixel folder + React folder (with index.tsx)  	|
| Service App (Node) 	|   	| Service App template (middleware & clients folders, service.json & index.ts)             	|
| Admin App          	|   	| Admin folder (navigation & routes.json) + React folder                                   	|

 All templates except Empty, Pixel and Node may add `Additional React folders`, which adds the following folders: assets, context, graphql, hooks, iconLibreary, utils