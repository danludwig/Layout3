﻿using Newtonsoft.Json;

namespace UCosmic.Domain.Files
{
    public class LoadableFile : Entity
    {
        protected internal LoadableFile()
        {
        }

        public int Id { get; protected set; }
        public virtual LoadableFileBinary Binary { get; protected internal set; }
        public int Length { get; protected internal set; }
        public string MimeType { get; protected internal set; }
        public string Name { get; protected internal set; }
    }


    internal static class LoadableFileSerializer
    {
        internal static string ToJsonAudit(this LoadableFile entity)
        {
            var state = JsonConvert.SerializeObject(new
            {
                entity.Id,
                entity.Length,
                entity.Name,
                entity.MimeType,
                //file.Binary.Content, // this works, but unnecessarily bloats the database
            });
            return state;
        }
    }
}