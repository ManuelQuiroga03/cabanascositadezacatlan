using System.Data;

namespace CositadeZacatlan.Application.Interfaces;

public interface IUnitOfWork
{
    Task<IDisposable?> BeginTransactionAsync(IsolationLevel isolationLevel = IsolationLevel.RepeatableRead, CancellationToken ct = default);
    Task CommitTransactionAsync(CancellationToken ct = default);
    Task RollbackTransactionAsync(CancellationToken ct = default);
}
