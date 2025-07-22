import { Router } from "express";
import multer from "multer";
import {
  getOrganizations,
  createOrganization,
  editOrganization,
  getOrganizationsAndUserInOrganizationById,
} from "../controllers/organization.controller";
import {
  authenticateJWT,
  superAdminOnly,
  headOrAdminOnly,
  ALLROLE,
} from "../middlewares/auth.middleware";
import { getFromS3 } from "../controllers/file.controller";
import { Response, Request } from "express";

const router = Router();
const upload = multer();

// GET /organizations?campusId=CAMPUS_ID&organizationTypeId=ORGANIZATION_TYPE_ID
router.get("/", authenticateJWT, ALLROLE, getOrganizations);

// GET /organizations/:id
router.get(
  "/:id",
  authenticateJWT,
  ALLROLE,
  getOrganizationsAndUserInOrganizationById
);

// PUT /organizations/:id (รองรับอัปโหลดไฟล์)
router.put(
  "/:id",
  authenticateJWT,
  headOrAdminOnly,
  upload.single("image"), 
  editOrganization
);

// POST /organizations
router.post("/", authenticateJWT, superAdminOnly, createOrganization);

router.get("/image/*", async (req: Request, res: Response) => {
  try {
    const key = req.params[0]; // รองรับ path ยาว
    const fileStream = await getFromS3(key);

    if (!fileStream) {
      return res.status(404).json({ error: "File not found" });
    }

    const ext = key.split(".").pop()?.toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === "png") contentType = "image/png";
    else if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
    else if (ext === "gif") contentType = "image/gif";
    else if (ext === "webp") contentType = "image/webp";

    res.setHeader("Content-Type", contentType);

    if (fileStream && typeof (fileStream as any).pipe === "function") {
      (fileStream as any).pipe(res);
    } else if (fileStream instanceof Blob) {
      const arrayBuffer = await fileStream.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } else {
      res.send(fileStream);
    }
  } catch (error) {
    res.status(404).json({ error: "File not found" });
  }
});
export default router;
