/*
Deployment script for UCosmicTest

This code was generated by a tool.
Changes to this file may cause incorrect behavior and will be lost if
the code is regenerated.
*/

GO
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL, QUOTED_IDENTIFIER ON;

SET NUMERIC_ROUNDABORT OFF;


GO
--:setvar DatabaseName "UCosmicTest"
--:setvar DefaultFilePrefix "UCosmicTest"
--:setvar DefaultDataPath "c:\Program Files\Microsoft SQL Server\MSSQL10.SQLEXPRESS\MSSQL\DATA\"
--:setvar DefaultLogPath "c:\Program Files\Microsoft SQL Server\MSSQL10.SQLEXPRESS\MSSQL\DATA\"

--GO
--:on error exit
--GO
--/*
--Detect SQLCMD mode and disable script execution if SQLCMD mode is not supported.
--To re-enable the script after enabling SQLCMD mode, execute the following:
--SET NOEXEC OFF; 
--*/
--:setvar __IsSqlCmdEnabled "True"
--GO
--IF N'$(__IsSqlCmdEnabled)' NOT LIKE N'True'
--    BEGIN
--        PRINT N'SQLCMD mode must be enabled to successfully execute this script.';
--        SET NOEXEC ON;
--    END


--GO
--USE [$(DatabaseName)];


--GO
PRINT N'Dropping FK_Employees.Degree_Establishments.Establishment_InstitutionId...';


GO
ALTER TABLE [Employees].[Degree] DROP CONSTRAINT [FK_Employees.Degree_Establishments.Establishment_InstitutionId];


GO
PRINT N'Dropping FK_Employees.Degree_People.Person_PersonId...';


GO
ALTER TABLE [Employees].[Degree] DROP CONSTRAINT [FK_Employees.Degree_People.Person_PersonId];


GO
PRINT N'Dropping FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [Employees].[EmployeeModuleSettings] DROP CONSTRAINT [FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId];


GO
PRINT N'Dropping FK_Employees.EmployeeActivityType_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId...';


GO
ALTER TABLE [Employees].[EmployeeActivityType] DROP CONSTRAINT [FK_Employees.EmployeeActivityType_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];


GO
PRINT N'Dropping FK_Employees.EmployeeFacultyRank_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId...';


GO
ALTER TABLE [Employees].[EmployeeFacultyRank] DROP CONSTRAINT [FK_Employees.EmployeeFacultyRank_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];


GO
PRINT N'Dropping FK_Employees.EmployeeModuleSettingsNotifyingAdmins_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId...';


GO
ALTER TABLE [Employees].[EmployeeModuleSettingsNotifyingAdmins] DROP CONSTRAINT [FK_Employees.EmployeeModuleSettingsNotifyingAdmins_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];


GO
PRINT N'Dropping FK_Employees.LanguageExpertise_Languages.Language_LanguageId...';


GO
ALTER TABLE [Employees].[LanguageExpertise] DROP CONSTRAINT [FK_Employees.LanguageExpertise_Languages.Language_LanguageId];


GO
PRINT N'Dropping FK_Employees.LanguageExpertise_People.Person_PersonId...';


GO
ALTER TABLE [Employees].[LanguageExpertise] DROP CONSTRAINT [FK_Employees.LanguageExpertise_People.Person_PersonId];


GO
PRINT N'Dropping FK_Representatives.RepModuleSettings_Establishments.Establishment_OwnerId...';


GO
ALTER TABLE [Representatives].[RepModuleSettings] DROP CONSTRAINT [FK_Representatives.RepModuleSettings_Establishments.Establishment_OwnerId];


GO
PRINT N'Dropping FK_Establishments.Establishment_Establishments.Establishment_ParentId...';


GO
ALTER TABLE [Establishments].[Establishment] DROP CONSTRAINT [FK_Establishments.Establishment_Establishments.Establishment_ParentId];


GO
PRINT N'Dropping FK_Establishments.Establishment_Establishments.EstablishmentType_TypeId...';


GO
ALTER TABLE [Establishments].[Establishment] DROP CONSTRAINT [FK_Establishments.Establishment_Establishments.EstablishmentType_TypeId];


GO
PRINT N'Dropping FK_Establishments.EmailTemplate_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [Establishments].[EmailTemplate] DROP CONSTRAINT [FK_Establishments.EmailTemplate_Establishments.Establishment_EstablishmentId];


GO
PRINT N'Dropping FK_Establishments.EstablishmentLocation_Establishments.Establishment_RevisionId...';


GO
ALTER TABLE [Establishments].[EstablishmentLocation] DROP CONSTRAINT [FK_Establishments.EstablishmentLocation_Establishments.Establishment_RevisionId];


GO
PRINT N'Dropping FK_Establishments.EstablishmentEmailDomain_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [Establishments].[EstablishmentEmailDomain] DROP CONSTRAINT [FK_Establishments.EstablishmentEmailDomain_Establishments.Establishment_EstablishmentId];


GO
PRINT N'Dropping FK_Establishments.EstablishmentName_Establishments.Establishment_ForEstablishmentId...';


GO
ALTER TABLE [Establishments].[EstablishmentName] DROP CONSTRAINT [FK_Establishments.EstablishmentName_Establishments.Establishment_ForEstablishmentId];


GO
PRINT N'Dropping FK_Establishments.EstablishmentNode_Establishments.Establishment_AncestorId...';


GO
ALTER TABLE [Establishments].[EstablishmentNode] DROP CONSTRAINT [FK_Establishments.EstablishmentNode_Establishments.Establishment_AncestorId];


GO
PRINT N'Dropping FK_Establishments.EstablishmentNode_Establishments.Establishment_OffspringId...';


GO
ALTER TABLE [Establishments].[EstablishmentNode] DROP CONSTRAINT [FK_Establishments.EstablishmentNode_Establishments.Establishment_OffspringId];


GO
PRINT N'Dropping FK_Establishments.EstablishmentSamlSignOn_Establishments.Establishment_Id...';


GO
ALTER TABLE [Establishments].[EstablishmentSamlSignOn] DROP CONSTRAINT [FK_Establishments.EstablishmentSamlSignOn_Establishments.Establishment_Id];


GO
PRINT N'Dropping FK_Establishments.EstablishmentUrl_Establishments.Establishment_ForEstablishmentId...';


GO
ALTER TABLE [Establishments].[EstablishmentUrl] DROP CONSTRAINT [FK_Establishments.EstablishmentUrl_Establishments.Establishment_ForEstablishmentId];


GO
PRINT N'Dropping FK_Identity.RoleGrant_Establishments.Establishment_ForEstablishmentId...';


GO
ALTER TABLE [Identity].[RoleGrant] DROP CONSTRAINT [FK_Identity.RoleGrant_Establishments.Establishment_ForEstablishmentId];


GO
PRINT N'Dropping FK_InstitutionalAgreements.InstitutionalAgreementConfiguration_Establishments.Establishment_ForEstablishmentId...';


GO
ALTER TABLE [InstitutionalAgreements].[InstitutionalAgreementConfiguration] DROP CONSTRAINT [FK_InstitutionalAgreements.InstitutionalAgreementConfiguration_Establishments.Establishment_ForEstablishmentId];


GO
PRINT N'Dropping FK_InstitutionalAgreements.InstitutionalAgreementParticipant_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [InstitutionalAgreements].[InstitutionalAgreementParticipant] DROP CONSTRAINT [FK_InstitutionalAgreements.InstitutionalAgreementParticipant_Establishments.Establishment_EstablishmentId];


GO
PRINT N'Dropping FK_People.Affiliation_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [People].[Affiliation] DROP CONSTRAINT [FK_People.Affiliation_Establishments.Establishment_EstablishmentId];


GO
PRINT N'Starting rebuilding table [Employees].[Degree]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [Employees].[tmp_ms_xx_Degree] (
    [RevisionId]         INT              IDENTITY (1, 1) NOT NULL,
    [PersonId]           INT              NOT NULL,
    [Title]              NVARCHAR (256)   NOT NULL,
    [FieldOfStudy]       NVARCHAR (256)   NULL,
    [YearAwarded]        INT              NULL,
    [InstitutionId]      INT              NULL,
    [EntityId]           UNIQUEIDENTIFIER NOT NULL,
    [CreatedOnUtc]       DATETIME         NOT NULL,
    [CreatedByPrincipal] NVARCHAR (256)   NULL,
    [UpdatedOnUtc]       DATETIME         NULL,
    [UpdatedByPrincipal] NVARCHAR (256)   NULL,
    [Version]            ROWVERSION       NOT NULL,
    [IsCurrent]          BIT              NOT NULL,
    [IsArchived]         BIT              NOT NULL,
    [IsDeleted]          BIT              NOT NULL,
    CONSTRAINT [tmp_ms_xx_constraint_PK_Employees.Degree] PRIMARY KEY CLUSTERED ([RevisionId] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [Employees].[Degree])
    BEGIN
        SET IDENTITY_INSERT [Employees].[tmp_ms_xx_Degree] ON;
        INSERT INTO [Employees].[tmp_ms_xx_Degree] ([RevisionId], [PersonId], [Title], [YearAwarded], [InstitutionId], [EntityId], [CreatedOnUtc], [CreatedByPrincipal], [UpdatedOnUtc], [UpdatedByPrincipal], [IsCurrent], [IsArchived], [IsDeleted])
        SELECT   [RevisionId],
                 [PersonId],
                 [Title],
                 [YearAwarded],
                 [InstitutionId],
                 [EntityId],
                 [CreatedOnUtc],
                 [CreatedByPrincipal],
                 [UpdatedOnUtc],
                 [UpdatedByPrincipal],
                 [IsCurrent],
                 [IsArchived],
                 [IsDeleted]
        FROM     [Employees].[Degree]
        ORDER BY [RevisionId] ASC;
        SET IDENTITY_INSERT [Employees].[tmp_ms_xx_Degree] OFF;
    END

DROP TABLE [Employees].[Degree];

EXECUTE sp_rename N'[Employees].[tmp_ms_xx_Degree]', N'Degree';

EXECUTE sp_rename N'[Employees].[tmp_ms_xx_constraint_PK_Employees.Degree]', N'PK_Employees.Degree', N'OBJECT';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Creating [Employees].[Degree].[IX_PersonId]...';


GO
CREATE NONCLUSTERED INDEX [IX_PersonId]
    ON [Employees].[Degree]([PersonId] ASC);


GO
PRINT N'Creating [Employees].[Degree].[IX_InstitutionId]...';


GO
CREATE NONCLUSTERED INDEX [IX_InstitutionId]
    ON [Employees].[Degree]([InstitutionId] ASC);


GO
PRINT N'Starting rebuilding table [Employees].[EmployeeModuleSettings]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [Employees].[tmp_ms_xx_EmployeeModuleSettings] (
    [Id]                              INT           IDENTITY (1, 1) NOT NULL,
    [NotifyAdminOnUpdate]             BIT           NOT NULL,
    [PersonalInfoAnchorText]          NVARCHAR (64) NULL,
    [OfferCountry]                    BIT           NOT NULL,
    [OfferActivityType]               BIT           NOT NULL,
    [OfferFundingQuestions]           BIT           NOT NULL,
    [InternationalPedigreeTitle]      NVARCHAR (64) NULL,
    [EstablishmentsExternalSyncDate]  DATETIME      NULL,
    [EstablishmentsLastUpdateAttempt] DATETIME      NULL,
    [EstablishmentsUpdateFailCount]   INT           NULL,
    [EstablishmentsLastUpdateResult]  VARCHAR (16)  NULL,
    [EstablishmentId]                 INT           NOT NULL,
    CONSTRAINT [tmp_ms_xx_constraint_PK_Employees.EmployeeModuleSettings] PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [Employees].[EmployeeModuleSettings])
    BEGIN
        SET IDENTITY_INSERT [Employees].[tmp_ms_xx_EmployeeModuleSettings] ON;
        INSERT INTO [Employees].[tmp_ms_xx_EmployeeModuleSettings] ([Id], [NotifyAdminOnUpdate], [PersonalInfoAnchorText], [OfferCountry], [OfferActivityType], [OfferFundingQuestions], [InternationalPedigreeTitle], [EstablishmentId])
        SELECT   [Id],
                 [NotifyAdminOnUpdate],
                 [PersonalInfoAnchorText],
                 [OfferCountry],
                 [OfferActivityType],
                 [OfferFundingQuestions],
                 [InternationalPedigreeTitle],
                 [EstablishmentId]
        FROM     [Employees].[EmployeeModuleSettings]
        ORDER BY [Id] ASC;
        SET IDENTITY_INSERT [Employees].[tmp_ms_xx_EmployeeModuleSettings] OFF;
    END

DROP TABLE [Employees].[EmployeeModuleSettings];

EXECUTE sp_rename N'[Employees].[tmp_ms_xx_EmployeeModuleSettings]', N'EmployeeModuleSettings';

EXECUTE sp_rename N'[Employees].[tmp_ms_xx_constraint_PK_Employees.EmployeeModuleSettings]', N'PK_Employees.EmployeeModuleSettings', N'OBJECT';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Creating [Employees].[EmployeeModuleSettings].[IX_EstablishmentId]...';


GO
CREATE NONCLUSTERED INDEX [IX_EstablishmentId]
    ON [Employees].[EmployeeModuleSettings]([EstablishmentId] ASC);


GO
PRINT N'Starting rebuilding table [Employees].[LanguageExpertise]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [Employees].[tmp_ms_xx_LanguageExpertise] (
    [RevisionId]           INT              IDENTITY (1, 1) NOT NULL,
    [PersonId]             INT              NOT NULL,
    [LanguageId]           INT              NULL,
    [Other]                NVARCHAR (200)   NULL,
    [Dialect]              NVARCHAR (200)   NULL,
    [SpeakingProficiency]  INT              NOT NULL,
    [ListeningProficiency] INT              NOT NULL,
    [ReadingProficiency]   INT              NOT NULL,
    [WritingProficiency]   INT              NOT NULL,
    [EntityId]             UNIQUEIDENTIFIER NOT NULL,
    [CreatedOnUtc]         DATETIME         NOT NULL,
    [CreatedByPrincipal]   NVARCHAR (256)   NULL,
    [UpdatedOnUtc]         DATETIME         NULL,
    [UpdatedByPrincipal]   NVARCHAR (256)   NULL,
    [Version]              ROWVERSION       NOT NULL,
    [IsCurrent]            BIT              NOT NULL,
    [IsArchived]           BIT              NOT NULL,
    [IsDeleted]            BIT              NOT NULL,
    CONSTRAINT [tmp_ms_xx_constraint_PK_Employees.LanguageExpertise] PRIMARY KEY CLUSTERED ([RevisionId] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [Employees].[LanguageExpertise])
    BEGIN
        SET IDENTITY_INSERT [Employees].[tmp_ms_xx_LanguageExpertise] ON;
        INSERT INTO [Employees].[tmp_ms_xx_LanguageExpertise] ([RevisionId], [PersonId], [LanguageId], [Dialect], [Other], [SpeakingProficiency], [ListeningProficiency], [ReadingProficiency], [WritingProficiency], [EntityId], [CreatedOnUtc], [CreatedByPrincipal], [UpdatedOnUtc], [UpdatedByPrincipal], [IsCurrent], [IsArchived], [IsDeleted])
        SELECT   [RevisionId],
                 [PersonId],
                 [LanguageId],
                 [Dialect],
                 [Other],
                 [SpeakingProficiency],
                 [ListeningProficiency],
                 [ReadingProficiency],
                 [WritingProficiency],
                 [EntityId],
                 [CreatedOnUtc],
                 [CreatedByPrincipal],
                 [UpdatedOnUtc],
                 [UpdatedByPrincipal],
                 [IsCurrent],
                 [IsArchived],
                 [IsDeleted]
        FROM     [Employees].[LanguageExpertise]
        ORDER BY [RevisionId] ASC;
        SET IDENTITY_INSERT [Employees].[tmp_ms_xx_LanguageExpertise] OFF;
    END

DROP TABLE [Employees].[LanguageExpertise];

EXECUTE sp_rename N'[Employees].[tmp_ms_xx_LanguageExpertise]', N'LanguageExpertise';

EXECUTE sp_rename N'[Employees].[tmp_ms_xx_constraint_PK_Employees.LanguageExpertise]', N'PK_Employees.LanguageExpertise', N'OBJECT';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Creating [Employees].[LanguageExpertise].[IX_PersonId]...';


GO
CREATE NONCLUSTERED INDEX [IX_PersonId]
    ON [Employees].[LanguageExpertise]([PersonId] ASC);


GO
PRINT N'Creating [Employees].[LanguageExpertise].[IX_LanguageId]...';


GO
CREATE NONCLUSTERED INDEX [IX_LanguageId]
    ON [Employees].[LanguageExpertise]([LanguageId] ASC);


GO
PRINT N'Starting rebuilding table [Establishments].[Establishment]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [Establishments].[tmp_ms_xx_Establishment] (
    [RevisionId]                      INT              IDENTITY (1, 1) NOT NULL,
    [OfficialName]                    NVARCHAR (400)   NOT NULL,
    [WebsiteUrl]                      NVARCHAR (200)   NULL,
    [IsMember]                        BIT              NOT NULL,
    [CollegeBoardDesignatedIndicator] CHAR (6)         NULL,
    [UCosmicCode]                     CHAR (6)         NULL,
    [PublicPhone]                     NVARCHAR (50)    NULL,
    [PublicFax]                       NVARCHAR (50)    NULL,
    [PublicEmail]                     NVARCHAR (256)   NULL,
    [PartnerPhone]                    NVARCHAR (50)    NULL,
    [PartnerFax]                      NVARCHAR (50)    NULL,
    [PartnerEmail]                    NVARCHAR (256)   NULL,
    [ExternalId]                      NVARCHAR (32)    NULL,
    [EntityId]                        UNIQUEIDENTIFIER NOT NULL,
    [CreatedOnUtc]                    DATETIME         NOT NULL,
    [CreatedByPrincipal]              NVARCHAR (256)   NULL,
    [UpdatedOnUtc]                    DATETIME         NULL,
    [UpdatedByPrincipal]              NVARCHAR (256)   NULL,
    [Version]                         ROWVERSION       NOT NULL,
    [IsCurrent]                       BIT              NOT NULL,
    [IsArchived]                      BIT              NOT NULL,
    [IsDeleted]                       BIT              NOT NULL,
    [ParentId]                        INT              NULL,
    [TypeId]                          INT              NOT NULL,
    CONSTRAINT [tmp_ms_xx_constraint_PK_Establishments.Establishment] PRIMARY KEY CLUSTERED ([RevisionId] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [Establishments].[Establishment])
    BEGIN
        SET IDENTITY_INSERT [Establishments].[tmp_ms_xx_Establishment] ON;
        INSERT INTO [Establishments].[tmp_ms_xx_Establishment] ([RevisionId], [OfficialName], [WebsiteUrl], [IsMember], [CollegeBoardDesignatedIndicator], [UCosmicCode], [PublicPhone], [PublicFax], [PublicEmail], [PartnerPhone], [PartnerFax], [PartnerEmail], [EntityId], [CreatedOnUtc], [CreatedByPrincipal], [UpdatedOnUtc], [UpdatedByPrincipal], [IsCurrent], [IsArchived], [IsDeleted], [ParentId], [TypeId])
        SELECT   [RevisionId],
                 [OfficialName],
                 [WebsiteUrl],
                 [IsMember],
                 [CollegeBoardDesignatedIndicator],
                 [UCosmicCode],
                 [PublicPhone],
                 [PublicFax],
                 [PublicEmail],
                 [PartnerPhone],
                 [PartnerFax],
                 [PartnerEmail],
                 [EntityId],
                 [CreatedOnUtc],
                 [CreatedByPrincipal],
                 [UpdatedOnUtc],
                 [UpdatedByPrincipal],
                 [IsCurrent],
                 [IsArchived],
                 [IsDeleted],
                 [ParentId],
                 [TypeId]
        FROM     [Establishments].[Establishment]
        ORDER BY [RevisionId] ASC;
        SET IDENTITY_INSERT [Establishments].[tmp_ms_xx_Establishment] OFF;
    END

DROP TABLE [Establishments].[Establishment];

EXECUTE sp_rename N'[Establishments].[tmp_ms_xx_Establishment]', N'Establishment';

EXECUTE sp_rename N'[Establishments].[tmp_ms_xx_constraint_PK_Establishments.Establishment]', N'PK_Establishments.Establishment', N'OBJECT';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Creating [Establishments].[Establishment].[IX_ParentId]...';


GO
CREATE NONCLUSTERED INDEX [IX_ParentId]
    ON [Establishments].[Establishment]([ParentId] ASC);


GO
PRINT N'Creating [Establishments].[Establishment].[IX_TypeId]...';


GO
CREATE NONCLUSTERED INDEX [IX_TypeId]
    ON [Establishments].[Establishment]([TypeId] ASC);


GO
PRINT N'Creating [Establishments].[Establishment].[ST_Establishment_RevisionId_OfficialName]...';


GO
CREATE STATISTICS [ST_Establishment_RevisionId_OfficialName]
    ON [Establishments].[Establishment]([RevisionId], [OfficialName]);


GO
PRINT N'Creating [Establishments].[Establishment].[ST_Establishment_RevisionId_TypeId_OfficialName]...';


GO
CREATE STATISTICS [ST_Establishment_RevisionId_TypeId_OfficialName]
    ON [Establishments].[Establishment]([RevisionId], [TypeId], [OfficialName]);


GO
PRINT N'Creating FK_Employees.Degree_Establishments.Establishment_InstitutionId...';


GO
ALTER TABLE [Employees].[Degree] WITH NOCHECK
    ADD CONSTRAINT [FK_Employees.Degree_Establishments.Establishment_InstitutionId] FOREIGN KEY ([InstitutionId]) REFERENCES [Establishments].[Establishment] ([RevisionId]);


GO
PRINT N'Creating FK_Employees.Degree_People.Person_PersonId...';


GO
ALTER TABLE [Employees].[Degree] WITH NOCHECK
    ADD CONSTRAINT [FK_Employees.Degree_People.Person_PersonId] FOREIGN KEY ([PersonId]) REFERENCES [People].[Person] ([RevisionId]);


GO
PRINT N'Creating FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [Employees].[EmployeeModuleSettings] WITH NOCHECK
    ADD CONSTRAINT [FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId] FOREIGN KEY ([EstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]);


GO
PRINT N'Creating FK_Employees.EmployeeActivityType_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId...';


GO
ALTER TABLE [Employees].[EmployeeActivityType] WITH NOCHECK
    ADD CONSTRAINT [FK_Employees.EmployeeActivityType_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId] FOREIGN KEY ([EmployeeModuleSettingsId]) REFERENCES [Employees].[EmployeeModuleSettings] ([Id]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_Employees.EmployeeFacultyRank_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId...';


GO
ALTER TABLE [Employees].[EmployeeFacultyRank] WITH NOCHECK
    ADD CONSTRAINT [FK_Employees.EmployeeFacultyRank_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId] FOREIGN KEY ([EmployeeModuleSettingsId]) REFERENCES [Employees].[EmployeeModuleSettings] ([Id]);


GO
PRINT N'Creating FK_Employees.EmployeeModuleSettingsNotifyingAdmins_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId...';


GO
ALTER TABLE [Employees].[EmployeeModuleSettingsNotifyingAdmins] WITH NOCHECK
    ADD CONSTRAINT [FK_Employees.EmployeeModuleSettingsNotifyingAdmins_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId] FOREIGN KEY ([EmployeeModuleSettingsId]) REFERENCES [Employees].[EmployeeModuleSettings] ([Id]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_Employees.LanguageExpertise_Languages.Language_LanguageId...';


GO
ALTER TABLE [Employees].[LanguageExpertise] WITH NOCHECK
    ADD CONSTRAINT [FK_Employees.LanguageExpertise_Languages.Language_LanguageId] FOREIGN KEY ([LanguageId]) REFERENCES [Languages].[Language] ([Id]);


GO
PRINT N'Creating FK_Employees.LanguageExpertise_People.Person_PersonId...';


GO
ALTER TABLE [Employees].[LanguageExpertise] WITH NOCHECK
    ADD CONSTRAINT [FK_Employees.LanguageExpertise_People.Person_PersonId] FOREIGN KEY ([PersonId]) REFERENCES [People].[Person] ([RevisionId]);


GO
PRINT N'Creating FK_Representatives.RepModuleSettings_Establishments.Establishment_OwnerId...';


GO
ALTER TABLE [Representatives].[RepModuleSettings] WITH NOCHECK
    ADD CONSTRAINT [FK_Representatives.RepModuleSettings_Establishments.Establishment_OwnerId] FOREIGN KEY ([OwnerId]) REFERENCES [Establishments].[Establishment] ([RevisionId]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_Establishments.Establishment_Establishments.Establishment_ParentId...';


GO
ALTER TABLE [Establishments].[Establishment] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.Establishment_Establishments.Establishment_ParentId] FOREIGN KEY ([ParentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]);


GO
PRINT N'Creating FK_Establishments.Establishment_Establishments.EstablishmentType_TypeId...';


GO
ALTER TABLE [Establishments].[Establishment] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.Establishment_Establishments.EstablishmentType_TypeId] FOREIGN KEY ([TypeId]) REFERENCES [Establishments].[EstablishmentType] ([RevisionId]);


GO
PRINT N'Creating FK_Establishments.EmailTemplate_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [Establishments].[EmailTemplate] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.EmailTemplate_Establishments.Establishment_EstablishmentId] FOREIGN KEY ([EstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_Establishments.EstablishmentLocation_Establishments.Establishment_RevisionId...';


GO
ALTER TABLE [Establishments].[EstablishmentLocation] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.EstablishmentLocation_Establishments.Establishment_RevisionId] FOREIGN KEY ([RevisionId]) REFERENCES [Establishments].[Establishment] ([RevisionId]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_Establishments.EstablishmentEmailDomain_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [Establishments].[EstablishmentEmailDomain] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.EstablishmentEmailDomain_Establishments.Establishment_EstablishmentId] FOREIGN KEY ([EstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_Establishments.EstablishmentName_Establishments.Establishment_ForEstablishmentId...';


GO
ALTER TABLE [Establishments].[EstablishmentName] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.EstablishmentName_Establishments.Establishment_ForEstablishmentId] FOREIGN KEY ([ForEstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_Establishments.EstablishmentNode_Establishments.Establishment_AncestorId...';


GO
ALTER TABLE [Establishments].[EstablishmentNode] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.EstablishmentNode_Establishments.Establishment_AncestorId] FOREIGN KEY ([AncestorId]) REFERENCES [Establishments].[Establishment] ([RevisionId]);


GO
PRINT N'Creating FK_Establishments.EstablishmentNode_Establishments.Establishment_OffspringId...';


GO
ALTER TABLE [Establishments].[EstablishmentNode] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.EstablishmentNode_Establishments.Establishment_OffspringId] FOREIGN KEY ([OffspringId]) REFERENCES [Establishments].[Establishment] ([RevisionId]);


GO
PRINT N'Creating FK_Establishments.EstablishmentSamlSignOn_Establishments.Establishment_Id...';


GO
ALTER TABLE [Establishments].[EstablishmentSamlSignOn] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.EstablishmentSamlSignOn_Establishments.Establishment_Id] FOREIGN KEY ([Id]) REFERENCES [Establishments].[Establishment] ([RevisionId]);


GO
PRINT N'Creating FK_Establishments.EstablishmentUrl_Establishments.Establishment_ForEstablishmentId...';


GO
ALTER TABLE [Establishments].[EstablishmentUrl] WITH NOCHECK
    ADD CONSTRAINT [FK_Establishments.EstablishmentUrl_Establishments.Establishment_ForEstablishmentId] FOREIGN KEY ([ForEstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_Identity.RoleGrant_Establishments.Establishment_ForEstablishmentId...';


GO
ALTER TABLE [Identity].[RoleGrant] WITH NOCHECK
    ADD CONSTRAINT [FK_Identity.RoleGrant_Establishments.Establishment_ForEstablishmentId] FOREIGN KEY ([ForEstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_InstitutionalAgreements.InstitutionalAgreementConfiguration_Establishments.Establishment_ForEstablishmentId...';


GO
ALTER TABLE [InstitutionalAgreements].[InstitutionalAgreementConfiguration] WITH NOCHECK
    ADD CONSTRAINT [FK_InstitutionalAgreements.InstitutionalAgreementConfiguration_Establishments.Establishment_ForEstablishmentId] FOREIGN KEY ([ForEstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]) ON DELETE CASCADE;


GO
PRINT N'Creating FK_InstitutionalAgreements.InstitutionalAgreementParticipant_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [InstitutionalAgreements].[InstitutionalAgreementParticipant] WITH NOCHECK
    ADD CONSTRAINT [FK_InstitutionalAgreements.InstitutionalAgreementParticipant_Establishments.Establishment_EstablishmentId] FOREIGN KEY ([EstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]);


GO
PRINT N'Creating FK_People.Affiliation_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [People].[Affiliation] WITH NOCHECK
    ADD CONSTRAINT [FK_People.Affiliation_Establishments.Establishment_EstablishmentId] FOREIGN KEY ([EstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]) ON DELETE CASCADE;


GO
PRINT N'Checking existing data against newly created constraints';


GO
--USE [$(DatabaseName)];


--GO
ALTER TABLE [Employees].[Degree] WITH CHECK CHECK CONSTRAINT [FK_Employees.Degree_Establishments.Establishment_InstitutionId];

ALTER TABLE [Employees].[Degree] WITH CHECK CHECK CONSTRAINT [FK_Employees.Degree_People.Person_PersonId];

ALTER TABLE [Employees].[EmployeeModuleSettings] WITH CHECK CHECK CONSTRAINT [FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId];

ALTER TABLE [Employees].[EmployeeActivityType] WITH CHECK CHECK CONSTRAINT [FK_Employees.EmployeeActivityType_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];

ALTER TABLE [Employees].[EmployeeFacultyRank] WITH CHECK CHECK CONSTRAINT [FK_Employees.EmployeeFacultyRank_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];

ALTER TABLE [Employees].[EmployeeModuleSettingsNotifyingAdmins] WITH CHECK CHECK CONSTRAINT [FK_Employees.EmployeeModuleSettingsNotifyingAdmins_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];

ALTER TABLE [Employees].[LanguageExpertise] WITH CHECK CHECK CONSTRAINT [FK_Employees.LanguageExpertise_Languages.Language_LanguageId];

ALTER TABLE [Employees].[LanguageExpertise] WITH CHECK CHECK CONSTRAINT [FK_Employees.LanguageExpertise_People.Person_PersonId];

ALTER TABLE [Representatives].[RepModuleSettings] WITH CHECK CHECK CONSTRAINT [FK_Representatives.RepModuleSettings_Establishments.Establishment_OwnerId];

ALTER TABLE [Establishments].[Establishment] WITH CHECK CHECK CONSTRAINT [FK_Establishments.Establishment_Establishments.Establishment_ParentId];

ALTER TABLE [Establishments].[Establishment] WITH CHECK CHECK CONSTRAINT [FK_Establishments.Establishment_Establishments.EstablishmentType_TypeId];

ALTER TABLE [Establishments].[EmailTemplate] WITH CHECK CHECK CONSTRAINT [FK_Establishments.EmailTemplate_Establishments.Establishment_EstablishmentId];

ALTER TABLE [Establishments].[EstablishmentLocation] WITH CHECK CHECK CONSTRAINT [FK_Establishments.EstablishmentLocation_Establishments.Establishment_RevisionId];

ALTER TABLE [Establishments].[EstablishmentEmailDomain] WITH CHECK CHECK CONSTRAINT [FK_Establishments.EstablishmentEmailDomain_Establishments.Establishment_EstablishmentId];

ALTER TABLE [Establishments].[EstablishmentName] WITH CHECK CHECK CONSTRAINT [FK_Establishments.EstablishmentName_Establishments.Establishment_ForEstablishmentId];

ALTER TABLE [Establishments].[EstablishmentNode] WITH CHECK CHECK CONSTRAINT [FK_Establishments.EstablishmentNode_Establishments.Establishment_AncestorId];

ALTER TABLE [Establishments].[EstablishmentNode] WITH CHECK CHECK CONSTRAINT [FK_Establishments.EstablishmentNode_Establishments.Establishment_OffspringId];

ALTER TABLE [Establishments].[EstablishmentSamlSignOn] WITH CHECK CHECK CONSTRAINT [FK_Establishments.EstablishmentSamlSignOn_Establishments.Establishment_Id];

ALTER TABLE [Establishments].[EstablishmentUrl] WITH CHECK CHECK CONSTRAINT [FK_Establishments.EstablishmentUrl_Establishments.Establishment_ForEstablishmentId];

ALTER TABLE [Identity].[RoleGrant] WITH CHECK CHECK CONSTRAINT [FK_Identity.RoleGrant_Establishments.Establishment_ForEstablishmentId];

ALTER TABLE [InstitutionalAgreements].[InstitutionalAgreementConfiguration] WITH CHECK CHECK CONSTRAINT [FK_InstitutionalAgreements.InstitutionalAgreementConfiguration_Establishments.Establishment_ForEstablishmentId];

ALTER TABLE [InstitutionalAgreements].[InstitutionalAgreementParticipant] WITH CHECK CHECK CONSTRAINT [FK_InstitutionalAgreements.InstitutionalAgreementParticipant_Establishments.Establishment_EstablishmentId];

ALTER TABLE [People].[Affiliation] WITH CHECK CHECK CONSTRAINT [FK_People.Affiliation_Establishments.Establishment_EstablishmentId];


GO
PRINT N'Update complete.';


GO
