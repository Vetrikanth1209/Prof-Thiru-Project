import React from 'react';

const BillTemplate = ({ bill }) => {
  const safeBill = bill || {};
  const feesDetails = safeBill.feesDetails || { oldFees: 0, newFees: 0 };
  const totalPayable = (feesDetails.newFees || 0) - (safeBill.discount || 0) + (safeBill.fine || 0);
  const outstandingFees = (feesDetails.newFees || 0) > (safeBill.discount || 0)
    ? (feesDetails.newFees || 0) - (safeBill.discount || 0)
    : 0;
  const dueDate = safeBill.dueDate || '2025-06-30'; // Use bill.dueDate if provided, else fallback

  return (
    <div
      style={{
        width: '1180px', // A4 landscape
        minHeight: '800px',
        backgroundColor: '#f9f9f9',
        color: '#333',
        padding: '40px',
        fontFamily: '"Times New Roman", Times, serif',
        border: '2px solid #666',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          fontSize: '28px',
          fontWeight: 'bold',
          borderBottom: '4px solid #666',
          borderRadius: '8px 8px 0 0',
        }}
      >
        MUTHAYAMMAL ENGINEERING COLLEGE
      </div>

      {/* Two Columns */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginBottom: '30px' }}>
        {/* Left Column - Bill Details */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#4CAF50' }}>Bill Details</h3>
          <p style={{ margin: '12px 0', fontSize: '16px' }}>
            <strong>Academic Year:</strong> {safeBill.academicYear || 'N/A'}
          </p>
          <p style={{ margin: '12px 0', fontSize: '16px' }}>
            <strong>Department:</strong> {safeBill.department || 'N/A'}
          </p>
          <p style={{ margin: '12px 0', fontSize: '16px' }}>
            <strong>Roll No & Name:</strong> {(safeBill.rollNo || 'N/A') + ' - ' + (safeBill.name || 'N/A')}
          </p>
        </div>

        {/* Right Column - Summary */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#4CAF50' }}>Summary</h3>
          <p style={{ margin: '12px 0', fontSize: '16px' }}>
            <strong>Outstanding Fees:</strong> Rs {Number(outstandingFees).toFixed(2)}
          </p>
          <p style={{ margin: '12px 0', fontSize: '16px' }}>
            <strong>Due Date:</strong> {dueDate}
          </p>
          <p style={{ margin: '12px 0', fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
            <strong>Total Amount:</strong> Rs {Number(totalPayable).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Fees Table */}
      <div>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '20px', color: '#4CAF50' }}>Fee Particulars</h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#4CAF50', color: '#fff' }}>
              <th
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  textAlign: 'left',
                  borderBottom: '2px solid #666',
                }}
              >
                Sl.No
              </th>
              <th
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  textAlign: 'left',
                  borderBottom: '2px solid #666',
                }}
              >
                Fees Name / Particulars
              </th>
              <th
                style={{
                  padding: '12px',
                  fontSize: '16px',
                  textAlign: 'right',
                  borderBottom: '2px solid #666',
                }}
              >
                Amount (Rs)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '12px', fontSize: '16px' }}>1</td>
              <td style={{ padding: '12px', fontSize: '16px' }}>Tuition Fee</td>
              <td style={{ padding: '12px', fontSize: '16px', textAlign: 'right' }}>
                Rs {Number(feesDetails.oldFees || 0).toFixed(2)}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '12px', fontSize: '16px' }}>2</td>
              <td style={{ padding: '12px', fontSize: '16px' }}>Updated Fee</td>
              <td style={{ padding: '12px', fontSize: '16px', textAlign: 'right' }}>
                Rs {Number(feesDetails.newFees || 0).toFixed(2)}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '12px', fontSize: '16px' }}>3</td>
              <td style={{ padding: '12px', fontSize: '16px' }}>Discount</td>
              <td style={{ padding: '12px', fontSize: '16px', textAlign: 'right' }}>
                Rs {Number(safeBill.discount || 0).toFixed(2)}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '12px', fontSize: '16px' }}>4</td>
              <td style={{ padding: '12px', fontSize: '16px' }}>Fine</td>
              <td style={{ padding: '12px', fontSize: '16px', textAlign: 'right' }}>
                Rs {Number(safeBill.fine || 0).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ margin: '5px 0', fontSize: '16px', color: '#4CAF50' }}>Student / Parent Sign</p>
          <div style={{ height: '50px', borderTop: '2px dashed #4CAF50' }}></div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <p style={{ margin: '5px 0', fontSize: '16px', color: '#4CAF50' }}>Cashier Sign</p>
          <div style={{ height: '50px', borderTop: '2px dashed #4CAF50' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BillTemplate;