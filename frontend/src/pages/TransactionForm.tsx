import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Transaction } from '@/types';
import { UploadCloud } from 'lucide-react';

interface AddTransactionFormProps {
  onSave: (transaction: Transaction) => void;
  onFileSave: (file: File) => void;
  onClose: () => void;
  isLoading: boolean;
}

const categories = ["Food & Drink", "Transport", "Shopping", "Entertainment", "Housing", "Income", "Other"];

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onSave, onFileSave, onClose, isLoading }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (description && amount && date && category) {
            onSave({id:"inserted", description, amount: parseFloat(amount), date, category });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          onFileSave(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Manual Entry</h3>
                <div>
                    <Label htmlFor="desc">Description</Label>
                    <Input id="desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Coffee" disabled={isLoading} />
                </div>
                 <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={setCategory} value={category} disabled={isLoading}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="-5.50" disabled={isLoading} />
                    </div>
                    <div>
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} disabled={isLoading} />
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" isLoading={isLoading}>Save Manually</Button>
                </div>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
            </div>

            <div>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
                 <Button variant="outline" className="w-full" onClick={handleUploadClick} disabled={isLoading}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Transaction CSV
                 </Button>
            </div>
        </div>
    );
};

