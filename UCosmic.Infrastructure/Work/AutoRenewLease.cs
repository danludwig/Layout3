﻿using System;
using System.Threading;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace UCosmic.Work
{
    public class AutoRenewLease : IDisposable
    {
        private readonly CloudBlockBlob _blob;
        public readonly string LeaseId;
        private Thread _renewalThread;
        private bool _disposed;

        public bool HasLease { get { return LeaseId != null; } }

        public AutoRenewLease(CloudBlockBlob blob)
        {
            _blob = blob;

            // acquire lease
            LeaseId = blob.TryAcquireLease(TimeSpan.FromSeconds(60));
            if (!HasLease) return;

            // keep renewing lease
            // ReSharper disable FunctionNeverReturns
            _renewalThread = new Thread(() =>
            {
                while (true)
                {
                    Thread.Sleep(TimeSpan.FromSeconds(40.0));
                    blob.RenewLease(AccessCondition.GenerateLeaseCondition(LeaseId));
                }
            });
            // ReSharper restore FunctionNeverReturns
            _renewalThread.Start();
        }

        ~AutoRenewLease()
        {
            Dispose(false);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed) return;
            if (disposing && _renewalThread != null)
            {
                _renewalThread.Abort();
                _blob.ReleaseLease(AccessCondition.GenerateLeaseCondition(LeaseId));
                _renewalThread = null;
            }
            _disposed = true;
        }
    }
}