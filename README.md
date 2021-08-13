# Application Name

## Application Description
This Application is a Tool to create a diagram for an Application Landscape... 
 
## Quick Start Guide
-	How to connect to your remote Database	
-	How to manage diagrams	
-	How to manage applications	
-	How to manage Data Objects	
-	How to manage data flows	
-	How to export an application with	
-	How to Import applications from excel file	

 
## Quick Start Guide

IV User Manual
1.	How to connect to your remote database
In the first screen of the application, you will be greeted with a form to “Connect to a Database“. Here you can fill in the IP-Address with port and you can also define the specific database you want to work with. Also, you have to provide a username and a password for authentication to the MongoDB database. The latest information you fill into this field will be stored on the local copy of the application and will be loaded as default values for a fast workflow. When you have entered the connection information and click on “Connect“ you will be directed to the next window.


2.	How to manage diagrams
In the “Select the Diagram you want to work with:“ window you can manage your diagrams. You can choose whether you create a new diagram, or delete or work with an existing diagram. For creating a new diagram you can click on “New Diagram“. When a Name for the Diagram is set and confirmed with the Button “Create”. The diagram will be generated in the Database and will be opened. For deleting an existing diagram you choose the diagram you want to delete and click on the garbage icon. 
 
You are asked to confirm your decision for the case you misclicked. For working with an existing diagram you choose the diagram you want to work with and click on “Open Diagram“ to continue. You can always go back to this menu if you click on the sidebar and choose “Home“.


3.	How to manage applications
After you open a diagram you will get to the application landscape. On the left side, you see the palette where you can drag and drop an application on the diagram. For deleting you just have to click on an application and press the delete key on the keyboard. For a fast change of the application name, you can double-click on the application and type the new name in it. The colors of the applications show the user the status of the applications. Read more about this function in the “Application Properties“ part of Use Cases.

For editing an application you can right-click on the node. There you can see the Node menu where you can edit the node. The properties Name, Version and Description can be edited by the user as text fields. COTS is a dropdown menu, where the user can choose and edit this property by the following values: COTS, Proprietary and Undefined. Release and Shutdown Date are always in a date format, that the user can edit at any time by writing the date into the field or by clicking into the calendar symbol and choose a date in the calendar. Press “Save changes“ for saving or abort by clicking “Close“.

Between applications, you can create data flows by clicking and holding somewhere on the edge of an application and moving and dropping to another application. The user can add to each data flow multiple data objects. The automatic layout system will generate a good overview. It updates every time you add an application or a data flow. On the bottom left you you can see the whole diagram as miniature. Through holding the purple window you can move through the application landscape. 
By clicking on the three lines on the up left you can see the sidebar menu where you have further options to continue working. 


4.	How to manage data objects
In the sidebar, you can find the option “Manage Data Objects“. The user can edit here an existing data object or create a new one. If you want to create a new one the user can fill in the properties “Name“ and “Description“ and can check or uncheck the personal data property.

After saving the data object is in the data object list so the user can add the new data object to any data flow. You can also edit existing data objects. You can scroll through the data objects list and click on the one you want to edit. You can either delete or change the properties of the data object. If you want to save the edited data object you can press the save changes button. The user will get back to the application landscape and all dataflows where this data object was a part of will be updated with the changes. You can always abort and go back to the manage data objects menu. Like before you can choose one data object and delete it. Now you can go back to the manage data objects menu.

5.	How to manage data flows
In “3. Manage Applications“ you learn how to create data flows between applications. For deleting you just have to left-click on the dataflow and press the delete key on the keyboard. When you cover them with your mouse the dataflows you can edit them through a right-click. The blue color around the data flow indicates which one you are about to edit. Under the header “Dataflow“ you can see the data objects that are already added to the dataflow. Under that you see them listed with their name and the personal data property. On the right, you can remove them from the data flow by clicking on the garbage icon. If you click on one data object you can see the description as in the example picture in “Chat history“

On the bottom, you can add data objects by selecting the one you created and clicking on  “Add Data Object“. After that, you get back to the application landscape.

6.	How to export an application
When you click in the sidebar on export you can either export personal data or data objects. The exported file will be saved as CSV. If you click on “Export Personal Data“ a table will be created. This table contains all programs that work with personal data in the data object. Clicking on it opens a new window. In this window, you can choose where on your computer you want to save the file.

This file can be opened with Excel or imported into Excel. The other “Export DataObj“ exports all data objects used by the current diagram. Again, you can select the location and open it with Excel.

7.	How to import applications from an excel file
The user can import the application into the diagram from an existing excel file. At first, the user is going to be asked to choose an excel file. 
 
After that, the file is going to be temporarily uploaded into the server to be analyzed for the first time. Next, the user is going to be asked to choose a sheet where he can select which column represents which application property. This column-property mapping will be saved first locally. After the process it will be saved in the remote database, so by the next import, the process is easier.  
After already uploaded file in the server is going to be analyzed deeply, and all candidate rows are going to be converted into an application. Rows containing false data are going to be ignored. In the end, a report containing all information about ignored rows/applications is going to be generated and delivered. If you confirm by clicking accept the applications will be added to the diagram. 

 
## Applicaion Requirements
- Our Application requires Node.js to run

## Application Version
- 1.1
