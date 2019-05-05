import express from 'express'
import fetch from 'node-fetch'
import upload from '../../services/upload'

const router = express.Router()

router.post('/', async (req, res, next) => {
    try {
        const json = await upload.excel2json(req.files.excelFile)
        const newFormat = await upload.json2NewFormat(json)
        // console.log('newnew', newFormat)
        return res.send({ success: true, data: newFormat })
    } catch (e) {
        console.log(e)
        return res.stataus(500).send({ success: false })
    }
})

// INSERT INTO [dbo].[Party] ([lPartyID] ,[szOrganizationTypeCode],[szTypeCode],[lTechLayerAccessID]) VALUES  ('6352',NULL,'PS','1')	
// INSERT INTO [dbo].[PartyRole] ([lPartyID],[szPartyRoleTypeCode],[szEffectiveDate],[szExpirationDate],[szStatusCode],[lTechLayerAccessID]) VALUES ('6352','EMPL',NULL,NULL,'AC','1')	
// INSERT INTO [dbo].[Person]([lPartyID],[szSalutation],[szFirstName],[szMiddleInitial],[szLastName],[szGenderType],[szBirthDate],[szLanguageCode],[lTechLayerAccessID]) VALUES('6352','Mr',N'น.ส.เบญจวรรณ','S',N'แช่มจู','M',NULL,'en-GB','1')	
// INSERT INTO [dbo].[Employee] ([lEmployeeID],[szStatusCode],[szEmplName],[szPartyRoleTypeCode],[lPartyID],[szExternalID],[szLanguageCode],[lTechLayerAccessID] )VALUES ('6141470','AC',N'น.ส.เบญจวรรณ แช่มจู','EMPL','6352','1232','en-GB',1)	
// INSERT INTO [dbo].[Operator] ([lOperatorID],[lEmployeeID],[szSignOnName],[szSignOnPassword] ,[lPasswordExpirationRange] ,[lPasswordEntryErrorCount] ,[szSignOnPasswordHash],[szSignOnPasswordSalt]) VALUES ('6141470','6141470','6141470','pm01c/uwatU=','9999','5','Uf3/4qJv0q2Ia1Qj9Bl11HIzYAA/+j0JkGyGAjAXeb4=','PcOCRUFG/nf05g+xTgfhniTemspu1a0SbJRm2uIQXqcb')	
// INSERT INTO [dbo].[OperatorRetailStoreAffiliation]([lRetailStoreID],[lOperatorID],[lTechLayerAccessID])VALUES ('1232','6141470',1)	
// INSERT INTO [dbo].[OperatorProfileAffiliation]([lOperatorID],[lProfileID],[lRetailStoreID],[szEffectiveDate],[szExpirationDate])VALUES ('6141470','8','1232','20180918','29991231')			

export default router

