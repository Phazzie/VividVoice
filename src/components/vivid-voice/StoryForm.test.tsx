import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StoryForm } from './StoryForm';

describe('StoryForm', () => {
  it('should render the form with default story text and a submit button', () => {
    render(<StoryForm onSubmit={() => {}} isLoading={false} />);
    
    const textarea = screen.getByPlaceholderText('Paste your story here...');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue(`Narrator: The old house stood on a hill overlooking the town, its windows like vacant eyes. A cool breeze whispered through the tall grass, carrying with it the scent of rain and decay.
Alice: It looks a bit spooky. Are you sure about this, Bob?
Bob: Don't be silly, it's just an old house. Think of the adventure! We'll be famous!
Alice: I'd rather be safe than famous.
Narrator: Bob, ever the optimist, was already marching towards the creaking porch steps. Alice hesitated, pulling her shawl tighter around her shoulders.`);

    const submitButton = screen.getByRole('button', { name: /Start Generation/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('should call the onSubmit handler with the story text when the form is submitted', async () => {
    const handleSubmit = vi.fn();
    render(<StoryForm onSubmit={handleSubmit} isLoading={false} />);
    
    const textarea = screen.getByPlaceholderText('Paste your story here...');
    const newStory = 'This is a brand new story.';
    fireEvent.change(textarea, { target: { value: newStory } });
    
    const submitButton = screen.getByRole('button', { name: /Start Generation/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(newStory);
    });
  });

  it('should show a validation message if submitted with empty text', async () => {
    const handleSubmit = vi.fn();
    render(<StoryForm onSubmit={handleSubmit} isLoading={false} />);
    
    const textarea = screen.getByPlaceholderText('Paste your story here...');
    fireEvent.change(textarea, { target: { value: '' } });
    
    const submitButton = screen.getByRole('button', { name: /Start Generation/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
        expect(screen.getByText('Story text cannot be empty.')).toBeInTheDocument();
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should disable the submit button and show loading text when isLoading is true', () => {
    render(<StoryForm onSubmit={() => {}} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: /Analyzing.../i });
    expect(submitButton).toBeDisabled();
  });
});
