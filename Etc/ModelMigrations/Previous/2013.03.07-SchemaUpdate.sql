﻿/*
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
USE [UCosmicPreview];


GO
/*
The column [Employees].[EmployeeModuleSettings].[OfferFundingQuestions] on table [Employees].[EmployeeModuleSettings] must be added, but the column has no default value and does not allow NULL values. If the table contains data, the ALTER script will not work. To avoid this issue you must either: add a default value to the column, mark it as allowing NULL values, or enable the generation of smart-defaults as a deployment option.
*/

--IF EXISTS (select top 1 1 from [Employees].[EmployeeModuleSettings])
--    RAISERROR (N'Rows were detected. The schema update is terminating because data loss might occur.', 16, 127) WITH NOWAIT

--GO
PRINT N'Dropping FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [Employees].[EmployeeModuleSettings] DROP CONSTRAINT [FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId];


GO
PRINT N'Dropping FK_Employees.EmployeeFacultyRank_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId...';


GO
ALTER TABLE [Employees].[EmployeeFacultyRank] DROP CONSTRAINT [FK_Employees.EmployeeFacultyRank_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];


GO
PRINT N'Dropping FK_Employees.EmployeeModuleSettingsNotifyingAdmins_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId...';


GO
ALTER TABLE [Employees].[EmployeeModuleSettingsNotifyingAdmins] DROP CONSTRAINT [FK_Employees.EmployeeModuleSettingsNotifyingAdmins_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];


GO
PRINT N'Dropping FK_Activities.ActivityType_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId...';


GO
ALTER TABLE [Activities].[ActivityType] DROP CONSTRAINT [FK_Activities.ActivityType_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];


GO
PRINT N'Creating [ActivitiesV2]...';


GO
CREATE SCHEMA [ActivitiesV2]
    AUTHORIZATION [dbo];


GO
PRINT N'Starting rebuilding table [Employees].[EmployeeModuleSettings]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;
--IF EXISTS (select top 1 1 from [Employees].[EmployeeModuleSettings])
--    RAISERROR (N'Rows were detected. The schema update is terminating because data loss might occur.', 16, 127) WITH NOWAIT

--GO

CREATE TABLE [Employees].[tmp_ms_xx_EmployeeModuleSettings] (
    [Id]                     INT           IDENTITY (1, 1) NOT NULL,
    [NotifyAdminOnUpdate]    BIT           NOT NULL,
    [PersonalInfoAnchorText] NVARCHAR (64) NULL,
    [OfferCountry]           BIT           NOT NULL,
    [OfferActivityType]      BIT           NOT NULL,
    [OfferFundingQuestions]  BIT           NOT NULL,
    [EstablishmentId]        INT           NOT NULL,
    CONSTRAINT [tmp_ms_xx_constraint_PK_Employees.EmployeeModuleSettings] PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [Employees].[EmployeeModuleSettings])
    BEGIN
        SET IDENTITY_INSERT [Employees].[tmp_ms_xx_EmployeeModuleSettings] ON;
        INSERT INTO [Employees].[tmp_ms_xx_EmployeeModuleSettings] ([Id], [NotifyAdminOnUpdate], [PersonalInfoAnchorText], [OfferCountry], [OfferActivityType], [OfferFundingQuestions], [EstablishmentId])
        SELECT   [Id],
                 [NotifyAdminOnUpdate],
                 [PersonalInfoAnchorText],
                 [OfferCountry],
                 [OfferActivityType],
                 0,
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
PRINT N'Creating [ActivitiesV2].[ActivityLocation]...';


GO
CREATE TABLE [ActivitiesV2].[ActivityLocation] (
    [RevisionId]         INT              IDENTITY (1, 1) NOT NULL,
    [ActivityValuesId]   INT              NOT NULL,
    [PlaceId]            INT              NOT NULL,
    [EntityId]           UNIQUEIDENTIFIER NOT NULL,
    [CreatedOnUtc]       DATETIME         NOT NULL,
    [CreatedByPrincipal] NVARCHAR (256)   NULL,
    [UpdatedOnUtc]       DATETIME         NULL,
    [UpdatedByPrincipal] NVARCHAR (256)   NULL,
    [Version]            ROWVERSION       NOT NULL,
    [IsCurrent]          BIT              NOT NULL,
    [IsArchived]         BIT              NOT NULL,
    [IsDeleted]          BIT              NOT NULL,
    CONSTRAINT [PK_ActivitiesV2.ActivityLocation] PRIMARY KEY CLUSTERED ([RevisionId] ASC)
);


GO
PRINT N'Creating [ActivitiesV2].[ActivityType]...';


GO
CREATE TABLE [ActivitiesV2].[ActivityType] (
    [Id]                       INT            IDENTITY (1, 1) NOT NULL,
    [Type]                     NVARCHAR (128) NOT NULL,
    [EmployeeModuleSettingsId] INT            NULL,
    CONSTRAINT [PK_ActivitiesV2.ActivityType] PRIMARY KEY CLUSTERED ([Id] ASC)
);


GO
PRINT N'Creating [ActivitiesV2].[ActivityTag]...';


GO
CREATE TABLE [ActivitiesV2].[ActivityTag] (
    [RevisionId]         INT              IDENTITY (1, 1) NOT NULL,
    [ActivityId]         INT              NOT NULL,
    [Number]             INT              NOT NULL,
    [Text]               NVARCHAR (500)   NOT NULL,
    [DomainType]         NVARCHAR (20)    NOT NULL,
    [DomainKey]          INT              NULL,
    [Mode]               NVARCHAR (20)    NOT NULL,
    [EntityId]           UNIQUEIDENTIFIER NOT NULL,
    [CreatedOnUtc]       DATETIME         NOT NULL,
    [CreatedByPrincipal] NVARCHAR (256)   NULL,
    [UpdatedOnUtc]       DATETIME         NULL,
    [UpdatedByPrincipal] NVARCHAR (256)   NULL,
    [Version]            ROWVERSION       NOT NULL,
    [IsCurrent]          BIT              NOT NULL,
    [IsArchived]         BIT              NOT NULL,
    [IsDeleted]          BIT              NOT NULL,
    CONSTRAINT [PK_ActivitiesV2.ActivityTag] PRIMARY KEY CLUSTERED ([RevisionId] ASC)
);


GO
PRINT N'Creating [ActivitiesV2].[Activity]...';


GO
CREATE TABLE [ActivitiesV2].[Activity] (
    [RevisionId]         INT              IDENTITY (1, 1) NOT NULL,
    [PersonId]           INT              NOT NULL,
    [Number]             INT              NOT NULL,
    [Mode]               NVARCHAR (20)    NOT NULL,
    [EntityId]           UNIQUEIDENTIFIER NOT NULL,
    [CreatedOnUtc]       DATETIME         NOT NULL,
    [CreatedByPrincipal] NVARCHAR (256)   NULL,
    [UpdatedOnUtc]       DATETIME         NULL,
    [UpdatedByPrincipal] NVARCHAR (256)   NULL,
    [Version]            ROWVERSION       NOT NULL,
    [IsCurrent]          BIT              NOT NULL,
    [IsArchived]         BIT              NOT NULL,
    [IsDeleted]          BIT              NOT NULL,
    CONSTRAINT [PK_ActivitiesV2.Activity] PRIMARY KEY CLUSTERED ([RevisionId] ASC)
);


GO
PRINT N'Creating [ActivitiesV2].[ActivityValues]...';


GO
CREATE TABLE [ActivitiesV2].[ActivityValues] (
    [RevisionId]          INT              IDENTITY (1, 1) NOT NULL,
    [ActivityId]          INT              NOT NULL,
    [Title]               NVARCHAR (200)   NULL,
    [Content]             NTEXT            NULL,
    [StartsOn]            DATETIME         NULL,
    [EndsOn]              DATETIME         NULL,
    [TypeId]              INT              NULL,
    [Mode]                NVARCHAR (20)    NOT NULL,
    [WasExternallyFunded] BIT              NULL,
    [WasInternallyFunded] BIT              NULL,
    [EntityId]            UNIQUEIDENTIFIER NOT NULL,
    [CreatedOnUtc]        DATETIME         NOT NULL,
    [CreatedByPrincipal]  NVARCHAR (256)   NULL,
    [UpdatedOnUtc]        DATETIME         NULL,
    [UpdatedByPrincipal]  NVARCHAR (256)   NULL,
    [Version]             ROWVERSION       NOT NULL,
    [IsCurrent]           BIT              NOT NULL,
    [IsArchived]          BIT              NOT NULL,
    [IsDeleted]           BIT              NOT NULL,
    CONSTRAINT [PK_ActivitiesV2.ActivityValues] PRIMARY KEY CLUSTERED ([RevisionId] ASC)
);


GO
PRINT N'Creating FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId...';


GO
ALTER TABLE [Employees].[EmployeeModuleSettings] WITH NOCHECK
    ADD CONSTRAINT [FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId] FOREIGN KEY ([EstablishmentId]) REFERENCES [Establishments].[Establishment] ([RevisionId]);


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
PRINT N'Checking existing data against newly created constraints';


GO
ALTER TABLE [Employees].[EmployeeModuleSettings] WITH CHECK CHECK CONSTRAINT [FK_Employees.EmployeeModuleSettings_Establishments.Establishment_EstablishmentId];

ALTER TABLE [Employees].[EmployeeFacultyRank] WITH CHECK CHECK CONSTRAINT [FK_Employees.EmployeeFacultyRank_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];

ALTER TABLE [Employees].[EmployeeModuleSettingsNotifyingAdmins] WITH CHECK CHECK CONSTRAINT [FK_Employees.EmployeeModuleSettingsNotifyingAdmins_Employees.EmployeeModuleSettings_EmployeeModuleSettingsId];


GO
PRINT N'Update complete.';


GO
