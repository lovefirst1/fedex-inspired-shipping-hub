import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Plus, Trash2 } from "lucide-react";
import { currencies } from "@/data/currencies";
import html2pdf from "html2pdf.js";

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

const InvoiceGenerator = () => {
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    currency: "USD",
    // Sender (Company) details
    companyName: "SwiftEx Logistics",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    // Receiver (Client) details
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    // Additional
    notes: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0 }
  ]);

  const [showPreview, setShowPreview] = useState(false);

  const getCurrencySymbol = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    return currency?.symbol || code;
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    const element = invoiceRef.current;
    const opt = {
      margin: 0.5,
      filename: `${invoiceData.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast({
        title: "Success!",
        description: "Invoice downloaded as PDF",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `${getCurrencySymbol(invoiceData.currency)}${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Create Invoice</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(!showPreview)}
          >
            <FileText className="mr-2 h-4 w-4" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
          {showPreview && (
            <Button onClick={handleDownloadPDF} className="bg-accent hover:bg-accent/90">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {!showPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoice Details */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Invoice Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select 
                  value={invoiceData.currency} 
                  onValueChange={(value) => setInvoiceData({ ...invoiceData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input
                  type="date"
                  value={invoiceData.date}
                  onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Company (Sender) Details */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">From (Your Company)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  required
                  value={invoiceData.companyName}
                  onChange={(e) => setInvoiceData({ ...invoiceData, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={invoiceData.companyAddress}
                  onChange={(e) => setInvoiceData({ ...invoiceData, companyAddress: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={invoiceData.companyEmail}
                    onChange={(e) => setInvoiceData({ ...invoiceData, companyEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={invoiceData.companyPhone}
                    onChange={(e) => setInvoiceData({ ...invoiceData, companyPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Client (Receiver) Details */}
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Bill To (Client)</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  required
                  value={invoiceData.clientName}
                  onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={invoiceData.clientAddress}
                  onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={invoiceData.clientEmail}
                    onChange={(e) => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={invoiceData.clientPhone}
                    onChange={(e) => setInvoiceData({ ...invoiceData, clientPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Items */}
          <Card className="p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-semibold text-lg">Items / Services</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-6 space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label>Unit Price ({getCurrencySymbol(invoiceData.currency)})</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(calculateSubtotal())}</p>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6 space-y-4 lg:col-span-2">
            <h3 className="font-semibold text-lg border-b pb-2">Notes</h3>
            <Textarea
              placeholder="Additional notes or terms..."
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              rows={3}
            />
          </Card>
        </div>
      ) : (
        /* Invoice Preview */
        <Card className="p-8 bg-white">
          <div ref={invoiceRef} className="bg-white text-black p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-200">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{invoiceData.companyName}</h1>
                {invoiceData.companyAddress && (
                  <p className="text-gray-600 mt-2 whitespace-pre-line">{invoiceData.companyAddress}</p>
                )}
                {invoiceData.companyEmail && <p className="text-gray-600">{invoiceData.companyEmail}</p>}
                {invoiceData.companyPhone && <p className="text-gray-600">{invoiceData.companyPhone}</p>}
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-bold text-orange-500">INVOICE</h2>
                <p className="text-gray-600 mt-2">#{invoiceData.invoiceNumber}</p>
              </div>
            </div>

            {/* Dates and Client Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To:</h3>
                <p className="text-lg font-semibold text-gray-900">{invoiceData.clientName || "Client Name"}</p>
                {invoiceData.clientAddress && (
                  <p className="text-gray-600 whitespace-pre-line">{invoiceData.clientAddress}</p>
                )}
                {invoiceData.clientEmail && <p className="text-gray-600">{invoiceData.clientEmail}</p>}
                {invoiceData.clientPhone && <p className="text-gray-600">{invoiceData.clientPhone}</p>}
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-500 uppercase">Invoice Date: </span>
                  <span className="text-gray-900">{formatDate(invoiceData.date)}</span>
                </div>
                {invoiceData.dueDate && (
                  <div>
                    <span className="text-sm font-semibold text-gray-500 uppercase">Due Date: </span>
                    <span className="text-gray-900">{formatDate(invoiceData.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-500 uppercase">Description</th>
                  <th className="text-center py-3 text-sm font-semibold text-gray-500 uppercase">Qty</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-500 uppercase">Unit Price</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-gray-900">{item.description || "Item description"}</td>
                    <td className="py-4 text-center text-gray-900">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-900">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-4 text-right text-gray-900 font-medium">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-3 border-t-2 border-gray-900">
                  <span className="text-lg font-bold text-gray-900">TOTAL</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(calculateSubtotal())}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoiceData.notes && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes:</h3>
                <p className="text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
              <p>Thank you for your business!</p>
              <p className="mt-1">{invoiceData.companyName}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default InvoiceGenerator;
