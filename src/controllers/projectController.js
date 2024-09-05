"use strict";
 
const CustomError = require("../errors/customError");
const {
  idTypeValidationOr400,
  isExistOnTableOr404,
  mustRequirementOr400, 
} = require("../helpers/utils");
/* -------------------------------------------------------------------------- */
/*                             Project Controller                            */
/* -------------------------------------------------------------------------- */

const { Project } = require("../models/projectModel");

module.exports.project = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Projects"]
            #swagger.summary = "List Projects"
            #swagger.description = `
                List all Projects!</br></br>
                <b>Permission= No Permission</b></br>   
                You can send query with endpoint for filter[],search[], sort[], page and limit.
                <ul> Examples:
                    <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                    <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                    <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                    <li>URL/?<b>page=2&limit=1</b></li>
                </ul>
            `

            #swagger.responses[200] = {
            description: 'Successfully Listed!',
                schema: { 
                    error: false,
                    message: "Projects are listed!",
                    data:{$ref: '#/definitions/Project'} 
                }
            }


        */
    const projects = await Project.find();
    res.json(projects
    );
  },
  read: async (req, res) => {
    /*
            #swagger.tags = ["Projects"]
            #swagger.summary = "Get a Project"
            #swagger.description = `
                Get a Project by project id(ObjectId)!</br></br>
                <b>Permission= No permission</b></br>  
            `
            #swagger.responses[200] = {
            description: 'Successfully Found!',
                schema: { 
                    error: false,
                    message: "Project is found!",
                    data:{$ref: '#/definitions/Project'} 
                }
            }

            #swagger.responses[400] = {
            description:`Bad request - Invalid param Id type! (it Should be ObjectId)!`
            }

            #swagger.responses[404] = {
            description:`Not found - Project not found!`
            }

        */

    //id check if it is objectId
    idTypeValidationOr400(
      req.params.id,
      "Invalid param Id type! (it Should be ObjectId)"
    );
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   throw new CustomError(
    //     "Invalid param Id type! (it Should be ObjectId)",
    //     400
    //   );
    // }

    const project = await isExistOnTableOr404(
      Project,
      { _id: req.params.id },
      "Project not found!"
    );
    // const project = await Project.findOne({ _id: req.params.id });

    // if (!project) {
    //   throw new CustomError("Project not found!", 404);
    // }

    res.json({
      error: false,
      message: `Project is found!`,
      data: project,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Projects"]
            #swagger.summary = "Create Project"
            #swagger.description = `
                Create a Project!</br></br>
                <b>Permission= Admin user</b></br></br> 
            `

            #swagger.parameters['body']={
                in:'body',
                required:true,
                schema:{
                    "projectName": "Capsblog-fullstack",
                    "projectLiveLink": "https://capsblog-fs-express-react.onrender.com/",
                    "projectRepo": "https://github.com/ibrsec/Capsblog-fullstack",
                    "projectGif": "https://github.com/ibrsec/Capsblog-fullstack/raw/master/client/public/project.gif",
                    "category": [
                        "fullstack",
                        "react",
                        "express"
                    ]
    }
            }
            #swagger.responses[201] = {
            description: 'Successfully created!',
            schema: { 
                error: false,
                message: "A new project is created!",
                data:{$ref: '#/definitions/Project'} 
            }

        }   

 


        */

    // * Checks if a requirement is mandatory based on the provided name in the request body.
    const { projectName, projectLiveLink,projectRepo, projectGif, category } = req.body;
    mustRequirementOr400({ projectName, projectLiveLink,projectRepo, projectGif, category });
    // if (!req.body.name) {
    //   throw new CustomError("name field is required!", 400);
    // }

 


 


    delete req.body.createdAt;
    delete req.body.updatedAt;


    const newProject = await Project.create(req.body); //create new project

    res.status(201).json({
      error: false,
      message: "A new project is created!",
      data: newProject,
    });
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Projects"]
            #swagger.summary = "UPDATE Project"
            #swagger.description = `
                Update a Project with id(ObjectId)!</br></br>
                <b>Permission= Admin user</b></br></br> 
            `

            #swagger.parameters['body']={
                in:'body',
                required:true,
                schema:{
                    "projectName": "Capsblog-fullstack",
                    "projectLiveLink": "https://capsblog-fs-express-react.onrender.com/",
                    "projectRepo": "https://github.com/ibrsec/Capsblog-fullstack",
                    "projectGif": "https://github.com/ibrsec/Capsblog-fullstack/raw/master/client/public/project.gif",
                    "category": [
                        "fullstack",
                        "react",
                        "express"
                    ]
    }
            }
            #swagger.responses[202] = {
            description: 'Successfully updated!',
            schema: { 
                error: false,
                message: "Project is updated!",
                data:{$ref: '#/definitions/Project'} 
            }

        }   



        */

    //id type validation
    idTypeValidationOr400(req.params.id,"Invalid param Id type! (it Should be ObjectId)!");
    // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    //   throw new CustomError(
    //     "Invalid param Id type! (it Should be ObjectId)",
    //     400
    //   );
    // }
    const { projectName, projectLiveLink,projectRepo, projectGif, category } = req.body;
    mustRequirementOr400({ projectName, projectLiveLink,projectRepo, projectGif, category });
 
  



    
    await isExistOnTableOr404(
      Project,
      { _id: req.params.id },
      "Project not found for update!"
    ); 



    delete req.body.createdAt;
    delete req.body.updatedAt;



    const { modifiedCount } = await Project.updateOne(
      { _id: req.params.id },
      req.body,
      { runValidators: true }
    );
    if (modifiedCount < 1) {
      throw new CustomError(
        "Something went wrong! - Project is found! But it couldn't be updated!",
        500
      );
    }

    res.status(202).json({
      error: false,
      message: "Project is updated!",
      data: await Project.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /*
  #swagger.tags = ["Projects"]
  #swagger.summary = "Delete a Project"
  #swagger.description = `
      Delete a Project by project id(ObjectId)!</br></br>
      <b>Permission= Admin user</b></br>  
  `
  #swagger.responses[200] = {
  description: 'Successfully Deleted!',
      schema: { 
          error: false,
          message: "Project is deleted!",
          data:{$ref: '#/definitions/Project'} 
      }
  }

  #swagger.responses[400] = {
  description:`Bad request - Invalid param Id type! (it Should be ObjectId)!`
  }

  #swagger.responses[404] = {
  description:`Not found - Project not found for deletion!`
  }
  #swagger.responses[500] = {
  description:`Something went wrong! - Project is found! But it couldn't be deleted!`
  }

*/


    //id check
    idTypeValidationOr400(req.params.id, "Invalid param Id type! (it Should be ObjectId)")
  

    await isExistOnTableOr404(Project,{ _id: req.params.id }, "Project not found for deletion!")
     

    const { deletedCount } = await Project.deleteOne({ _id: req.params.id });
    if (deletedCount < 1) {
      throw new CustomError(
        "Something went wrong! - Project is found! But it couldn't be deleted!",
        500
      );
    }

    res.sendStatus(204);
  },
};
