import React, { useState } from 'react';

const initialData = [
  { id: 1, name: 'John', age: 25 },
  { id: 2, name: 'Doe', age: 30 },
  { id: 3, name: 'Jane', age: 28 },
];

const Table = () => {
  const [data, setData] = useState(initialData);
  const [editingId, setEditingId] = useState(null);
  const [newRow, setNewRow] = useState({ id: null, name: '', age: '' });

  const handleEdit = (id) => {
    setEditingId(id);
    const editingRow = data.find((row) => row.id === id);
    setNewRow(editingRow);
  };

  const handleSave = () => {
    const updatedData = data.map((row) =>
      row.id === newRow.id ? { ...newRow } : row
    );
    setData(updatedData);
    setEditingId(null);
    setNewRow({ id: null, name: '', age: '' });
  };

  const handleDelete = (id) => {
    const updatedData = data.filter((row) => row.id !== id);
    setData(updatedData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>
                {editingId === row.id ? (
                  <input
                    type="text"
                    name="name"
                    value={newRow.name}
                    onChange={handleChange}
                  />
                ) : (
                  row.name
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <input
                    type="number"
                    name="age"
                    value={newRow.age}
                    onChange={handleChange}
                  />
                ) : (
                  row.age
                )}
              </td>
              <td>
                {editingId === row.id ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(row.id)}>Edit</button>
                    <button onClick={() => handleDelete(row.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
