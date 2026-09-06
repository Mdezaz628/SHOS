import React from 'react';

export const Table = ({
  columns = [],
  data = [],
  keyExtractor,
  emptyMessage = 'No records found.',
  className = ''
}) => {
  return (
    <div className={`shos-table-container ${className}`}>
      <table className="shos-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={col.key || idx} style={col.width ? { width: col.width } : {}}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-dim)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => {
              const rowKey = keyExtractor ? keyExtractor(row, rowIdx) : row.id || rowIdx;
              return (
                <tr key={rowKey}>
                  {columns.map((col, colIdx) => {
                    const val = col.render ? col.render(row, rowIdx) : row[col.key];
                    return <td key={col.key || colIdx}>{val}</td>;
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
