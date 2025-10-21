import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import type { DecisionCategory, DecisionOption } from '@/types';
import { useDecisions } from '@/contexts/DecisionContext';

interface DecisionFormProps {
  open: boolean;
  onClose: () => void;
}

const categories: { value: DecisionCategory; label: string }[] = [
  { value: 'career', label: 'Career' },
  { value: 'business', label: 'Business' },
  { value: 'personal', label: 'Personal' },
  { value: 'financial', label: 'Financial' },
  { value: 'health', label: 'Health' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'other', label: 'Other' },
];

export function DecisionForm({ open, onClose }: DecisionFormProps) {
  const { addDecision } = useDecisions();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DecisionCategory>('other');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<DecisionOption[]>([
    { id: crypto.randomUUID(), description: '', pros: [], cons: [] },
  ]);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');

  const handleAddOption = () => {
    setOptions([...options, { id: crypto.randomUUID(), description: '', pros: [], cons: [] }]);
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((opt) => opt.id !== id));
    if (selectedOptionId === id) {
      setSelectedOptionId('');
    }
  };

  const handleUpdateOption = (id: string, field: keyof DecisionOption, value: any) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt))
    );
  };

  const handleAddPro = (optionId: string) => {
    handleUpdateOption(optionId, 'pros', [
      ...options.find((o) => o.id === optionId)!.pros,
      '',
    ]);
  };

  const handleAddCon = (optionId: string) => {
    handleUpdateOption(optionId, 'cons', [
      ...options.find((o) => o.id === optionId)!.cons,
      '',
    ]);
  };

  const handleUpdatePro = (optionId: string, index: number, value: string) => {
    const option = options.find((o) => o.id === optionId)!;
    const newPros = [...option.pros];
    newPros[index] = value;
    handleUpdateOption(optionId, 'pros', newPros);
  };

  const handleUpdateCon = (optionId: string, index: number, value: string) => {
    const option = options.find((o) => o.id === optionId)!;
    const newCons = [...option.cons];
    newCons[index] = value;
    handleUpdateOption(optionId, 'cons', newCons);
  };

  const handleRemovePro = (optionId: string, index: number) => {
    const option = options.find((o) => o.id === optionId)!;
    handleUpdateOption(optionId, 'pros', option.pros.filter((_, i) => i !== index));
  };

  const handleRemoveCon = (optionId: string, index: number) => {
    const option = options.find((o) => o.id === optionId)!;
    handleUpdateOption(optionId, 'cons', option.cons.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !context || !selectedOptionId || !reasoning || !expectedOutcome) {
      alert('Please fill in all required fields');
      return;
    }

    addDecision({
      title,
      category,
      context,
      options: options.filter((opt) => opt.description.trim() !== ''),
      selectedOptionId,
      reasoning,
      expectedOutcome,
    });

    // Reset form
    setTitle('');
    setCategory('other');
    setContext('');
    setOptions([{ id: crypto.randomUUID(), description: '', pros: [], cons: [] }]);
    setSelectedOptionId('');
    setReasoning('');
    setExpectedOutcome('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Decision Entry</DialogTitle>
          <DialogDescription>
            Document your decision-making process for future reflection and learning.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Decision Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Should I accept the job offer?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as DecisionCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Context */}
          <div className="space-y-2">
            <Label htmlFor="context">Context & Background *</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Describe the situation, constraints, and relevant information..."
              rows={4}
              required
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options Considered</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            {options.map((option, index) => (
              <Card
                key={option.id}
                className={selectedOptionId === option.id ? 'ring-2 ring-primary' : ''}
              >
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={option.description}
                        onChange={(e) =>
                          handleUpdateOption(option.id, 'description', e.target.value)
                        }
                        placeholder={`Option ${index + 1} description...`}
                      />
                    </div>
                    <Button
                      type="button"
                      variant={selectedOptionId === option.id ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setSelectedOptionId(option.id)}
                      title="Select this option"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    {options.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(option.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pros */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Pros</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddPro(option.id)}
                          className="h-6 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      {option.pros.map((pro, proIndex) => (
                        <div key={proIndex} className="flex gap-2">
                          <Input
                            value={pro}
                            onChange={(e) =>
                              handleUpdatePro(option.id, proIndex, e.target.value)
                            }
                            placeholder="Pro..."
                            className="text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemovePro(option.id, proIndex)}
                            className="h-9 w-9"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Cons */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-muted-foreground">Cons</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddCon(option.id)}
                          className="h-6 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                      {option.cons.map((con, conIndex) => (
                        <div key={conIndex} className="flex gap-2">
                          <Input
                            value={con}
                            onChange={(e) =>
                              handleUpdateCon(option.id, conIndex, e.target.value)
                            }
                            placeholder="Con..."
                            className="text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCon(option.id, conIndex)}
                            className="h-9 w-9"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reasoning */}
          <div className="space-y-2">
            <Label htmlFor="reasoning">Your Reasoning *</Label>
            <Textarea
              id="reasoning"
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Explain why you chose this option over others..."
              rows={4}
              required
            />
          </div>

          {/* Expected Outcome */}
          <div className="space-y-2">
            <Label htmlFor="expectedOutcome">Expected Outcome *</Label>
            <Textarea
              id="expectedOutcome"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              placeholder="What do you expect to happen as a result of this decision?"
              rows={3}
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Decision</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
