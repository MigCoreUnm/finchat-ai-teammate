import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Policy } from '@/types';

// This list should ideally be consistent with the categories your AI uses.
const transactionCategories = [
    "Food & Drink",
    "Transport",
    "Shopping",
    "Entertainment",
    "Housing",
    "Utilities",
    "Groceries",
    "Health",
    "Other"
];

interface AddPolicyFormProps {
  // The onSave function now expects the data needed to create a new policy
  onSave: (policyData: Omit<Policy, 'policy_id' | 'current_spending' | 'timeframe'>) => void;
  onClose: () => void;
  isLoading: boolean;
}

export const AddPolicyForm: React.FC<AddPolicyFormProps> = ({ onSave, onClose, isLoading }) => {
  const [description, setDescription] = useState('');
  const [limitAmount, setLimitAmount] = useState('');
  const [targetCategory, setTargetCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description && limitAmount && targetCategory) {
      onSave({
        description,
        limit_amount: parseFloat(limitAmount),
        target_category: targetCategory,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="policy-description">Policy Description</Label>
        <Input 
            id="policy-description" 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="e.g., Keep coffee budget in check" 
            disabled={isLoading}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="limit-amount">Monthly Limit ($)</Label>
          <Input 
            id="limit-amount" 
            type="number" 
            value={limitAmount} 
            onChange={e => setLimitAmount(e.target.value)} 
            placeholder="e.g., 50" 
            disabled={isLoading}
          />
        </div>
         <div>
          <Label htmlFor="target-category">Spending Category</Label>
          <Select onValueChange={setTargetCategory} value={targetCategory} disabled={isLoading}>
              <SelectTrigger id="target-category">
                  <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                  {transactionCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
              </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>Save Policy</Button>
      </div>
    </form>
  );
};
