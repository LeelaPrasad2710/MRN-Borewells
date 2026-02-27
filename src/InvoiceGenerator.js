import React, { useState } from "react";
import "./InvoiceGenerator.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoiceGenerator = () => {
  const [rows, setRows] = useState([
    { description: "Drilling Charges", depth: "001 To 300", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "001 To 100", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "101 To 200", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "201 To 300", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "301 To 400", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "401 To 500", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "501 To 600", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "601 To 700", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "701 To 800", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "801 To 900", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "901 To 1000", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "1001 To 1100", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "1101 To 1200", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "1201 To 1300", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "1301 To 1400", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "1401 To 1500", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "1501 To 1600", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "1601 To 1700", quantity: "", price: "", amount: 0 },
    { description: "Drilling Charges", depth: "1701 To 1800", quantity: "", price: "", amount: 0 },
    { description: "Casing Pipe MS 7\"", depth: "", quantity: "", price: "", amount: 0 },
    { description: "Casing Pipe PVC 10\"", depth: "", quantity: "", price: "", amount: 0 },
    { description: "Coller", depth: "", quantity: "", price: "", amount: 0 },
    { description: "Wielding", depth: "", quantity: "", price: "", amount: 0 },
    { description: "Labor & Transport", depth: "", quantity: "", price: "", amount: 0 },
    { description: "Water Injection", depth: "", quantity: "", price: "", amount: 0 },
    { description: "Filter Casing", depth: "", quantity: "", price: "", amount: 0 },
  ]);

  const [netTotal, setNetTotal] = useState(0);
  const [advancePaid, setAdvancePaid] = useState(0);
  const [amountPayable, setAmountPayable] = useState(0);
  const [amountPayableWords, setAmountPayableWords] = useState("");
  const [to, setTo] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [clientGst, setclientGst] = useState("");
  const [clientContact, setclientContact] = useState("");


  const deleteRow = (index) => {
    const updatedRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(updatedRows);
  };

  const clearTableData = () => {
    const updatedRows = rows.map(row => ({ ...row, quantity: "", price: "", amount: 0 }));
    setRows(updatedRows);
    calculateTotal(updatedRows);
  };

  const clearHeaderFields = () => {
    setTo("");
    setClientAddress("");
    setPlaceOfSupply("");
    setclientGst("");
    setclientContact("");
  };

  const clearPriceOnly = () => {
    const updatedRows = rows.map(row => ({ ...row, price: "", amount: 0 }));
    setRows(updatedRows);
    calculateTotal(updatedRows);
  };

  const exportToPDF = () => {
    const invoice = document.getElementById("invoice-content");
    if (!invoice) {
      console.error("Invoice element not found");
      return;
    }

    const invoiceClone = invoice.cloneNode(true);
    invoiceClone.style.width = "800px";
    invoiceClone.style.position = 'absolute';
    invoiceClone.style.left = '-9999px';
    document.body.appendChild(invoiceClone);

    // Hide delete buttons and the entire delete column
    const deleteColumns = invoiceClone.querySelectorAll(".delete-column");
    deleteColumns.forEach(column => column.remove()); // Completely remove the column

    const buttonContainer = invoiceClone.querySelector(".button-container");
    if (buttonContainer) {
      buttonContainer.style.display = 'none';
    }

    const inputs = invoiceClone.querySelectorAll("input");
    inputs.forEach(input => {
      const span = document.createElement('span');
      span.textContent = input.value || "";
      span.style.padding = "2px";
      input.parentNode.replaceChild(span, input);
    });

    const pdfOptions = {
      scale: 1.5,
      quality: 0.9,
      useCORS: true,
      allowTaint: true,
      logging: false,
      height: invoiceClone.scrollHeight,
      windowWidth: 800,
      windowHeight: invoiceClone.scrollHeight
    };

    html2canvas(invoiceClone, pdfOptions)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = Math.min(
          (canvas.height * pdfWidth) / canvas.width,
          pdf.internal.pageSize.getHeight() * 1.5
        );

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        const fileName = to ? `${to.replace(/\s+/g, "_")}_invoice.pdf` : "invoice.pdf";
        pdf.save(fileName);

        document.body.removeChild(invoiceClone);
      })
      .catch(error => {
        console.error('Error generating PDF:', error);
        document.body.removeChild(invoiceClone);
      });
  };


  const numberToWords = (num) => {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convert = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
      if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
      if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
      return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
    };

    return convert(num);
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;

    if (name === "quantity" || name === "price") {
      updatedRows[index].amount =
        (updatedRows[index].quantity || 0) * (updatedRows[index].price || 0);
    }

    setRows(updatedRows);
    calculateTotal(updatedRows);
  };

  const calculateTotal = (rows) => {
    const total = rows.reduce((sum, row) => sum + (row.amount || 0), 0);
    setNetTotal(total);
    const payable = total - advancePaid;
    setAmountPayable(payable);
    setAmountPayableWords(numberToWords(Math.round(payable)));
  };

  const handleAdvanceChange = (event) => {
    let value = event.target.value;
  

    if (value.startsWith("0") && value.length > 1) {
      value = value.replace(/^0+/, "");
    }
  
    if (value === "") {
      setAdvancePaid(""); // Allow empty input temporarily
      setAmountPayable(netTotal);
      setAmountPayableWords(numberToWords(Math.round(netTotal)));
    } else {
      const numericValue = parseFloat(value) || 0;
      setAdvancePaid(numericValue);
  
      const payable = netTotal - numericValue;
      setAmountPayable(payable);
      setAmountPayableWords(numberToWords(Math.round(payable)));
    }
  };
  


  return (
    <div className="invoice-container" id="invoice-content">
      <header className="invoice-header">
        <h1>MRN BOREWELLS</h1>
        <p>Contact:+91 9945033227</p>
        <p>Kariyanapalya,Subramanyapura post,BSK 6th Stage,Banglore-98</p>
      </header>
      <div className="invoice-detailsED">
        <p>E-Bill</p>
      </div>

      <div className="invoice-details">
        <label>Client GST:</label>
        <input type="text" value={clientGst} onChange={(e) => setclientGst(e.target.value)} />

        <label>Mobile No:</label>
        <input type="text" value={clientContact} onChange={(e) => setclientContact(e.target.value)} />

        <label>To:</label>
        <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />

        <label>Place of Supply & Work:</label>
        <input type="text" value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} />

        <label>Address Of Client:</label>
        <input type="text" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />

        <label>Date:</label>
        <input type="date" />
      </div>


      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Depth</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Amount</th>
            <th className="delete-column">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.description}</td>
              <td>{row.depth}</td>
              <td><input type="number" name="quantity" value={row.quantity} onChange={(e) => handleInputChange(index, e)} /></td>
              <td><input type="number" name="price" value={row.price} onChange={(e) => handleInputChange(index, e)} /></td>
              <td>{row.amount.toFixed(2)}</td>
              <td className="delete-column">
                <button className="delete-button" onClick={() => deleteRow(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="invoice-summary-container">
      <div className="bank-details">
        <strong>Bank Details:</strong><br />
        <span>Bank: AXIS BANK</span><br />
        <span>Branch: Uttarahalli Branch</span><br />
        <span>Account Name: K Manohar</span><br />
        <span>Account Number: 924010000095361</span><br />
        <span>IFSC: UTIB0002043</span><br />
        <strong>Authorized Signature:</strong>
      </div>

        <div className="invoice-summary">
          <p>Total: ₹{netTotal.toFixed(2)}</p>

          <p>
            <strong>Advance Paid:</strong>
            <input type="number" value={advancePaid} onChange={handleAdvanceChange} />
          </p>
          <p><strong>Amount Payable:</strong> ₹{amountPayable.toFixed(2)}</p>
          <p><strong>Amount in Words:</strong> {amountPayableWords} Only</p>
        </div>
      </div>

      <div className="notes-section">
        <h4>Note: Please note the final amount may vary based on drilling depth. Please make a minimum 50% advance before drilling.</h4>
      </div>

      <div className="button-container">
        <button className="clear-table" onClick={clearTableData}>Clear Table Data</button>
        <button className="clear-header" onClick={clearHeaderFields}>Clear Header</button>
        <button className="clear-price" onClick={clearPriceOnly}>Clear Price</button>
        <button className="export-button" onClick={exportToPDF}>Export to PDF</button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
