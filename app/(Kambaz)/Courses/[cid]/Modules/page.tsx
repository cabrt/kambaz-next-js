"use client";

import React, { useState, useEffect, useCallback } from "react";
import { BsGripVertical } from "react-icons/bs";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { setModules, addModule, deleteModule, updateModule, editModule } from "./reducer";
import * as coursesClient from "../../client";
import * as modulesClient from "./client";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";

interface Lesson {
  _id: string;
  name: string;
  description: string;
  module: string;
}

interface Module {
  _id: string;
  name: string;
  course: string;
  lessons?: Lesson[];
  editing?: boolean;
}

interface RootState {
  modulesReducer: {
    modules: Module[];
  };
  accountReducer: {
    currentUser: {
      _id: string;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    } | null;
  };
}


export default function Modules() {
  const params = useParams();
  const cid = params.cid as string;
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();

  const fetchModules = useCallback(async () => {
    const modules = await coursesClient.findModulesForCourse(cid);
    dispatch(setModules(modules));
  }, [cid, dispatch]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const addModuleHandler = async () => {
    if (!cid) return;
    const newModule = await coursesClient.createModuleForCourse(cid, {
      name: moduleName,
      course: cid,
    });
    dispatch(addModule(newModule));
    setModuleName("");
  };

  const deleteModuleHandler = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };

  const updateModuleHandler = async (module: Module) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };
  
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "ADMIN";

  return (
    <div>
      {isFaculty && (
        <ModulesControls 
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={addModuleHandler}
        />
      )}
      <br /><br /><br /><br />
      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: Module) => (
            <ListGroupItem key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary">
                <BsGripVertical className="me-2 fs-3" />
                {!module.editing && module.name}
                {module.editing && (
                  <input
                    className="form-control w-50 d-inline-block"
                    onChange={(e) =>
                      updateModuleHandler({ ...module, name: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        updateModuleHandler({ ...module, editing: false });
                      }
                    }}
                    value={module.name}
                  />
                )}
                {isFaculty && (
                  <ModuleControlButtons 
                    moduleId={module._id}
                    deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
                    editModule={(moduleId) => dispatch(editModule(moduleId))}
                  />
                )}
              </div>
              {module.lessons && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: Lesson) => (
                    <ListGroupItem key={lesson._id} className="wd-lesson p-3 ps-1">
                      <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </ListGroupItem>
          ))}
      </ListGroup>
    </div>
  );
}
