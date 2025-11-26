import "../../../lib/db";
import * as dao from "./dao";

interface ExpressRequest {
  body: Record<string, unknown>;
  query: Record<string, string | undefined>;
  params: Record<string, string>;
  session: {
    currentUser?: {
      _id: string;
      username: string;
      [key: string]: unknown;
    };
    destroy?: (callback?: (err?: Error) => void) => void;
    [key: string]: unknown;
  };
}

interface ExpressResponse {
  json: (data: unknown) => void;
  status: (code: number) => ExpressResponse;
}

interface ExpressApp {
  post: (path: string, handler: (req: ExpressRequest, res: ExpressResponse) => void | Promise<void>) => void;
  get: (path: string, handler: (req: ExpressRequest, res: ExpressResponse) => void | Promise<void>) => void;
  put: (path: string, handler: (req: ExpressRequest, res: ExpressResponse) => void | Promise<void>) => void;
  delete: (path: string, handler: (req: ExpressRequest, res: ExpressResponse) => void | Promise<void>) => void;
}

export default function UserRoutes(app: ExpressApp) {
  const signin = async (req: ExpressRequest, res: ExpressResponse) => {
    const { username, password } = req.body;
    const usernameStr = typeof username === "string" ? username : "";
    const passwordStr = typeof password === "string" ? password : "";
    const currentUser = await dao.findUserByCredentials(usernameStr, passwordStr);
    if (currentUser) {
      req.session["currentUser"] = currentUser.toObject() as ExpressRequest["session"]["currentUser"];
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signup = async (req: ExpressRequest, res: ExpressResponse) => {
    const username = typeof req.body.username === "string" ? req.body.username : "";
    const user = await dao.findUserByUsername(username);
    if (user) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body as unknown as dao.User);
    req.session["currentUser"] = currentUser.toObject() as ExpressRequest["session"]["currentUser"];
    res.json(currentUser);
  };

  const profile = async (req: ExpressRequest, res: ExpressResponse) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Please sign in" });
      return;
    }
    const userId = typeof currentUser._id === "string" ? currentUser._id : "";
    const user = await dao.findUserById(userId);
    res.json(user);
  };

  const updateProfile = async (req: ExpressRequest, res: ExpressResponse) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Please sign in" });
      return;
    }
    const userId = typeof currentUser._id === "string" ? currentUser._id : "";
    const user = req.body;
    await dao.updateUser(userId, user as Partial<dao.User>);
    const updatedUser = await dao.findUserById(userId);
    if (updatedUser) {
      req.session["currentUser"] = updatedUser.toObject() as ExpressRequest["session"]["currentUser"];
    }
    res.json(updatedUser);
  };

  const signout = async (req: ExpressRequest, res: ExpressResponse) => {
    if (req.session.destroy) {
      req.session.destroy();
    }
    res.json(200);
  };

  const account = async (req: ExpressRequest, res: ExpressResponse) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.status(401).json({ message: "Please sign in" });
      return;
    }
    res.json(currentUser);
  };

  const findAllUsers = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      // Extract query parameters - handle both string and array cases
      const roleParam = req.query.role;
      const nameParam = req.query.name;
      
      const role = typeof roleParam === "string" && roleParam.trim() !== "" ? roleParam.trim() : undefined;
      const name = typeof nameParam === "string" && nameParam.trim() !== "" ? nameParam.trim() : undefined;
      
      console.log("Query params - role:", role, "name:", name);
      
      // Handle both role and name filters together
      if (role && name) {
        console.log("Filtering by both role and name");
        const users = await dao.findUsersByRoleAndName(role, name);
        console.log("Found users:", users?.length);
        res.json(users);
        return;
      }
      
      // Handle role filter only
      if (role) {
        console.log("Filtering by role only:", role);
        const users = await dao.findUsersByRole(role);
        console.log("Found users:", users?.length);
        res.json(users);
        return;
      }
      
      // Handle name filter only
      if (name) {
        console.log("Filtering by name only:", name);
        const users = await dao.findUsersByPartialName(name);
        console.log("Found users:", users?.length);
        res.json(users);
        return;
      }
      
      // No filters - return all users
      console.log("No filters - returning all users");
      const users = await dao.findAllUsers();
      console.log("Found users:", users?.length);
      res.json(users);
    } catch (error) {
      console.error("Error in findAllUsers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const findUserById = async (req: ExpressRequest, res: ExpressResponse) => {
    const userId = req.params.userId;
    const user = await dao.findUserById(userId);
    res.json(user);
  };

  const deleteUser = async (req: ExpressRequest, res: ExpressResponse) => {
    const userId = req.params.userId;
    await dao.deleteUser(userId);
    res.json(200);
  };

  app.post("/api/users/signin", signin);
  app.post("/api/users/signup", signup);
  app.post("/api/users/profile", profile);
  app.put("/api/users/profile", updateProfile);
  app.post("/api/users/signout", signout);
  app.post("/api/users/account", account);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.delete("/api/users/:userId", deleteUser);
}

