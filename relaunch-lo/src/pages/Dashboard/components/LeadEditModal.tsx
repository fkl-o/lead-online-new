import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit3, Paperclip, MessageSquare, X, User, Building, FileText, Send, Upload, FileIcon, Trash2 } from 'lucide-react';

interface Company {
  name?: string;
  website?: string;
  industry?: string;
  size?: string;
  phone?: string;
  address?: string;
}

interface Comment {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  type: 'email' | 'phone' | 'meeting' | 'proposal' | 'follow-up';
  subject?: string;
  content: string;
  date: string;
  direction?: 'inbound' | 'outbound';
}

interface Attachment {
  _id: string;
  filename: string;
  originalName?: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: string;
  uploadedBy?: {
    _id: string;
    name: string;
  };
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  salutation?: 'herr' | 'frau';
  phone?: string;
  source: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  value?: number;
  category?: string;
  estimatedCloseDate?: string;
  company?: Company;
  communications?: Comment[];
  attachments?: Attachment[];
}

interface LeadEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLead: Lead | null;
  editForm: Partial<Lead>;
  onFormChange: (field: string, value: any) => void;
  onSave: () => void;
  onAddComment: (commentText: string) => void;
}

const LeadEditModal = ({
  isOpen,
  onClose,
  selectedLead,
  editForm,
  onFormChange,
  onSave,
  onAddComment
}: LeadEditModalProps) => {const [newComment, setNewComment] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [phoneError, setPhoneError] = useState('');  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'processing'>('uploading');

  useEffect(() => {
    // Load current user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    document.body.style.overflow = "";
    setTimeout(() => {
      setIsMounted(false);
      onClose();
      setNewComment('');
    }, 300);
  }, [onClose]);
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();
  
  // Telefonnummer-Validierung
  const validatePhone = (phone: string) => {
    // Deutsche Telefonnummer-Regex (optional: +49, 0, verschiedene Formate)
    const phoneRegex = /^(\+49|0)[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handlePhoneChange = (value: string) => {
    onFormChange('phone', value);
    if (value && !validatePhone(value)) {
      setPhoneError('Bitte geben Sie eine gültige deutsche Telefonnummer ein');
    } else {
      setPhoneError('');
    }
  };

  // File-Drop-Handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && selectedLead) {
      const file = files[0];
      
      console.log('Starting drag&drop upload for file:', file.name);
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus('uploading');
      
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('file', file);      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
        // Simulate progress for fast uploads
      let progressSimulationInterval: NodeJS.Timeout | null = null;
      let hasRealProgress = false;
      
      // Start progress simulation
      const startProgressSimulation = () => {
        let simulatedProgress = 0;
        progressSimulationInterval = setInterval(() => {
          simulatedProgress += Math.random() * 15 + 5; // Random increment between 5-20%
          if (simulatedProgress < 85) {
            setUploadProgress(Math.round(simulatedProgress));
          } else {
            if (progressSimulationInterval) {
              clearInterval(progressSimulationInterval);
              progressSimulationInterval = null;
            }
            setUploadProgress(85);
          }
        }, 200);
      };
      
      // Track upload progress - show real progress from 0-100%
      xhr.upload.addEventListener('progress', (event) => {
        console.log('Drag&Drop - Progress event:', event.lengthComputable, event.loaded, event.total);
        
        if (event.lengthComputable) {
          hasRealProgress = true;
          
          // Stop simulation if we have real progress
          if (progressSimulationInterval) {
            clearInterval(progressSimulationInterval);
            progressSimulationInterval = null;
          }
            const percentComplete = (event.loaded / event.total) * 100;
          console.log(`Drag&Drop - Upload progress: ${event.loaded}/${event.total} = ${percentComplete}%`);
          console.log('Setting progress to:', Math.round(percentComplete));
          setUploadProgress(Math.round(percentComplete));
          setUploadStatus('uploading');
        } else {
          console.log('Drag&Drop - Progress event not computable');
        }
      });

      // Track when upload starts
      xhr.upload.addEventListener('loadstart', () => {
        console.log('Drag&Drop - Upload loadstart event');
        setUploadProgress(0);
        setUploadStatus('uploading');
        
        // Start simulation after a short delay if no real progress events come
        setTimeout(() => {
          if (!hasRealProgress && !progressSimulationInterval) {
            startProgressSimulation();
          }
        }, 100);
      });      // Track upload end - file received by server, now processing
      xhr.upload.addEventListener('loadend', () => {
        console.log('Drag&Drop - Upload loadend event - switching to processing');
        
        // Clean up simulation
        if (progressSimulationInterval) {
          clearInterval(progressSimulationInterval);
          progressSimulationInterval = null;
        }
        
        setUploadProgress(90);
        setUploadStatus('processing');
        
        // Simulate S3 upload progress from 90% to 99%
        let processingProgress = 90;
        const processingInterval = setInterval(() => {
          processingProgress += Math.random() * 3 + 1;
          if (processingProgress < 99) {
            setUploadProgress(Math.round(processingProgress));
          } else {
            clearInterval(processingInterval);
            setUploadProgress(99);
          }
        }, 300);
        
        // Store interval for cleanup
        (xhr as any).processingInterval = processingInterval;
      });// Handle completion
      xhr.addEventListener('load', () => {
        console.log('Upload completed with status:', xhr.status);
        
        // Clean up processing interval if it exists (Drag&Drop)
        if ((xhr as any).processingInterval) {
          clearInterval((xhr as any).processingInterval);
        }
        
        setUploadProgress(100);
        setUploadStatus('processing');
        
        // Brief delay to show completion
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setUploadStatus('uploading');
        }, 1000);
        
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            if (result.success && result.data) {
              onFormChange('attachments', result.data.attachments || []);
              alert(result.message || 'Datei erfolgreich hochgeladen');
            }
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            alert('Fehler beim Verarbeiten der Server-Antwort');
          }
        } else {
          console.error('Upload failed with status:', xhr.status);
          alert('Fehler beim Hochladen der Datei');
        }
      });      // Handle errors
      xhr.addEventListener('error', (error) => {
        console.error('Upload error:', error);
        
        // Clean up processing interval if it exists (Drag&Drop)
        if ((xhr as any).processingInterval) {
          clearInterval((xhr as any).processingInterval);
        }
        
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus('uploading');
        alert('Fehler beim Hochladen der Datei');
      });

      // Handle abort
      xhr.addEventListener('abort', () => {
        console.log('Upload aborted');
        
        // Clean up processing interval if it exists (Drag&Drop)
        if ((xhr as any).processingInterval) {
          clearInterval((xhr as any).processingInterval);
        }
        
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus('uploading');
      });

      // Send request
      xhr.open('POST', `http://localhost:5000/api/leads/${selectedLead._id}/attachments`);
      xhr.setRequestHeader('Authorization', token ? `Bearer ${token}` : '');
      console.log('Sending drag&drop upload request...');
      xhr.send(formData);
    }
  };  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedLead) {
      const file = e.target.files[0];
      e.target.value = '';
      
      console.log('Starting upload for file:', file.name);
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus('uploading');
      
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('file', file);      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
        // Simulate progress for fast uploads (same as drag&drop)
      let progressSimulationInterval: NodeJS.Timeout | null = null;
      let hasRealProgress = false;
      
      // Start progress simulation
      const startProgressSimulation = () => {
        let simulatedProgress = 0;
        progressSimulationInterval = setInterval(() => {
          simulatedProgress += Math.random() * 15 + 5; // Random increment between 5-20%
          if (simulatedProgress < 85) {
            setUploadProgress(Math.round(simulatedProgress));
          } else {
            if (progressSimulationInterval) {
              clearInterval(progressSimulationInterval);
              progressSimulationInterval = null;
            }
            setUploadProgress(85);
          }
        }, 200);
      };
      
      // Track upload progress - show real progress from 0-100%
      xhr.upload.addEventListener('progress', (event) => {
        console.log('File Select - Progress event:', event.lengthComputable, event.loaded, event.total);
        
        if (event.lengthComputable) {
          hasRealProgress = true;
          
          // Stop simulation if we have real progress
          if (progressSimulationInterval) {
            clearInterval(progressSimulationInterval);
            progressSimulationInterval = null;
          }
            const percentComplete = (event.loaded / event.total) * 100;
          console.log(`File Select - Upload progress: ${event.loaded}/${event.total} = ${percentComplete}%`);
          console.log('Setting progress to:', Math.round(percentComplete));
          setUploadProgress(Math.round(percentComplete));
          setUploadStatus('uploading');
        } else {
          console.log('File Select - Progress event not computable');
        }
      });

      // Track when upload starts
      xhr.upload.addEventListener('loadstart', () => {
        console.log('File Select - Upload loadstart event');
        setUploadProgress(0);
        setUploadStatus('uploading');
        
        // Start simulation after a short delay if no real progress events come
        setTimeout(() => {
          if (!hasRealProgress && !progressSimulationInterval) {
            startProgressSimulation();
          }
        }, 100);
      });

      // Track upload end - file received by server, now processing
      xhr.upload.addEventListener('loadend', () => {
        console.log('File Select - Upload loadend event - switching to processing');
        
        // Clean up simulation
        if (progressSimulationInterval) {
          clearInterval(progressSimulationInterval);
          progressSimulationInterval = null;
        }
        
        setUploadProgress(90);
        setUploadStatus('processing');
        
        // Simulate S3 upload progress from 90% to 99%
        let processingProgress = 90;
        const processingInterval = setInterval(() => {
          processingProgress += Math.random() * 3 + 1;
          if (processingProgress < 99) {
            setUploadProgress(Math.round(processingProgress));
          } else {
            clearInterval(processingInterval);
            setUploadProgress(99);
          }
        }, 300);
        
        // Store interval for cleanup
        (xhr as any).processingIntervalFileSelect = processingInterval;
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        console.log('Upload completed with status:', xhr.status);
        
        // Clean up processing interval if it exists (File Select)
        if ((xhr as any).processingIntervalFileSelect) {
          clearInterval((xhr as any).processingIntervalFileSelect);
        }
        
        setUploadProgress(100);
        
        // Brief delay to show 100% completion
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setUploadStatus('uploading');
        }, 500);
        
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            if (result.success && result.data) {
              onFormChange('attachments', result.data.attachments || []);
              alert(result.message || 'Datei erfolgreich hochgeladen');
            }
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            alert('Fehler beim Verarbeiten der Server-Antwort');
          }
        } else {
          console.error('Upload failed with status:', xhr.status);
          alert('Fehler beim Hochladen der Datei');
        }
      });      // Handle errors
      xhr.addEventListener('error', (error) => {
        console.error('Upload error:', error);
        
        // Clean up processing interval if it exists (File Select)
        if ((xhr as any).processingIntervalFileSelect) {
          clearInterval((xhr as any).processingIntervalFileSelect);
        }
        
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus('uploading');
        alert('Fehler beim Hochladen der Datei');
      });

      // Handle abort
      xhr.addEventListener('abort', () => {
        console.log('Upload aborted');
        
        // Clean up processing interval if it exists (File Select)
        if ((xhr as any).processingIntervalFileSelect) {
          clearInterval((xhr as any).processingIntervalFileSelect);
        }
        
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus('uploading');
      });

      // Send request
      xhr.open('POST', `http://localhost:5000/api/leads/${selectedLead._id}/attachments`);
      xhr.setRequestHeader('Authorization', token ? `Bearer ${token}` : '');
      console.log('Sending upload request...');
      xhr.send(formData);
    }
  };
  
  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };
  // Handle opening attachment with loading state
  const handleOpenAttachment = async (attachmentId: string) => {
    if (!selectedLead) return;
    
    // Set loading state for this specific file
    setDownloadingFiles(prev => new Set(prev).add(attachmentId));
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/leads/${selectedLead._id}/attachments/${attachmentId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }      // Get the filename from Content-Disposition header or use a default
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          // filename = filenameMatch[1]; // Not used in current implementation
        }
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Create object URL and open in new tab
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up object URL after a delay
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error('Error opening attachment:', error);
      alert('Fehler beim Öffnen der Datei');
    } finally {
      // Remove loading state
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(attachmentId);
        return newSet;
      });
    }
  };

  // Handle deleting attachment
  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!selectedLead) return;
    
    const confirmDelete = window.confirm('Sind Sie sicher, dass Sie diese Datei löschen möchten?');
    if (!confirmDelete) return;
    
    // Set loading state for this specific file
    setDeletingFiles(prev => new Set(prev).add(attachmentId));
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/leads/${selectedLead._id}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }      const result = await response.json();      // Update successful - show success message and update form data
      if (result.success && result.data) {
        alert(result.message || 'Datei erfolgreich gelöscht');
        // Update the form with new data (attachment list updated)
        onFormChange('attachments', result.data.attachments || []);
      }
      
    } catch (error) {
      console.error('Error deleting attachment:', error);
      alert('Fehler beim Löschen der Datei');
    } finally {
      // Remove loading state
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(attachmentId);
        return newSet;
      });
    }
  };

  if (!isMounted) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        onClick={stopPropagation}
        className={`bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl w-full flex flex-col overflow-hidden max-h-[90vh] transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-95'}`}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-brand-600" />
            <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
              Lead bearbeiten: {selectedLead?.name}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-auto pr-3 thin-scrollbar" type="always">
          <div className="px-1 pb-4">
            {selectedLead && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Persönliche Informationen */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                      <User className="h-4 w-4 text-brand-600" />
                      Persönliche Informationen
                    </h4>                    <div>
                      <Label htmlFor="salutation" className="font-semibold text-slate-700 block mb-2">Anrede *</Label>
                      <Select value={editForm.salutation || ''} onValueChange={(value) => onFormChange('salutation', value)}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Anrede auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="herr">Herr</SelectItem>
                          <SelectItem value="frau">Frau</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="name" className="font-semibold text-slate-700 block mb-2">Name *</Label>
                      <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                        <Input
                          type="text"
                          id="name"
                          value={editForm.name || ''}
                          onChange={(e) => onFormChange('name', e.target.value)}
                          className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-semibold text-slate-700 block mb-2">E-Mail *</Label>
                      <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                        <Input
                          type="email"
                          id="email"
                          value={editForm.email || ''}
                          onChange={(e) => onFormChange('email', e.target.value)}
                          className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone" className="font-semibold text-slate-700 block mb-2">Telefon</Label>
                      <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                        <Input
                          type="tel"
                          id="phone"
                          value={editForm.phone || ''}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="z.B. +49 30 12345678 oder 030 12345678"
                          className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        />
                      </div>
                      {phoneError && (
                        <p className="text-sm text-red-600 mt-1">{phoneError}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="source" className="font-semibold text-slate-700 block mb-2">Quelle</Label>
                      <div className="flex w-full rounded-md border border-muted-foreground/20 bg-muted/50 h-12">
                        <Input
                          type="text"
                          id="source"
                          value={editForm.source || ''}
                          disabled
                          className="flex-1 border-0 rounded-md bg-transparent text-muted-foreground cursor-not-allowed h-full"                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Die Quelle kann nicht geändert werden</p>
                    </div>
                  </div>

                  {/* Unternehmensinformationen */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                      <Building className="h-4 w-4 text-brand-600" />
                      Unternehmensinformationen
                    </h4>
                    <div>
                      <Label htmlFor="company-name" className="font-semibold text-slate-700 block mb-2">Unternehmen</Label>
                      <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                        <Input
                          type="text"
                          id="company-name"
                          value={editForm.company?.name || ''}
                          onChange={(e) => onFormChange('company.name', e.target.value)}
                          className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company-website" className="font-semibold text-slate-700 block mb-2">Website</Label>
                      <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                        <div className="flex items-center bg-muted/50 px-3 text-sm text-muted-foreground rounded-l-md border-r">
                          https://
                        </div>
                        <Input
                          type="text"
                          id="company-website"
                          placeholder="ihre-firma.de"
                          value={editForm.company?.website?.replace('https://', '') || ''}
                          onChange={(e) => onFormChange('company.website', `https://${e.target.value}`)}
                          className="flex-1 border-0 rounded-none rounded-r-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company-industry" className="font-semibold text-slate-700 block mb-2">Branche</Label>
                      <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                        <Input
                          type="text"
                          id="company-industry"
                          value={editForm.company?.industry || ''}
                          onChange={(e) => onFormChange('company.industry', e.target.value)}
                          className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company-size" className="font-semibold text-slate-700 block mb-2">Unternehmensgröße</Label>
                      <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                        <select 
                          id="company-size" 
                          value={editForm.company?.size || ''} 
                          onChange={(e) => onFormChange('company.size', e.target.value)}
                          className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full bg-transparent px-3"
                        >
                          <option value="">Bitte wählen</option>
                          <option value="1-10">1-10 Mitarbeiter</option>
                          <option value="11-50">11-50 Mitarbeiter</option>
                          <option value="51-200">51-200 Mitarbeiter</option>
                          <option value="201-1000">201-1000 Mitarbeiter</option>
                          <option value="1000+">1000+ Mitarbeiter</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notizen */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-brand-600" />
                    Notizen
                  </h4>
                  <div>
                    <Label htmlFor="notes" className="font-semibold text-slate-700 block mb-2">Interne Notizen</Label>
                    <Textarea
                      id="notes"
                      value={editForm.notes || ''}
                      onChange={(e) => onFormChange('notes', e.target.value)}
                      placeholder="Notizen zu diesem Lead..."
                      rows={4}
                      className="w-full resize-none"
                    />
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg border text-sm text-slate-600">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div><strong>Erstellt:</strong> {new Date(selectedLead.createdAt).toLocaleString('de-DE')}</div>
                      <div><strong>Aktualisiert:</strong> {selectedLead.updatedAt ? new Date(selectedLead.updatedAt).toLocaleString('de-DE') : 'Nie'}</div>
                      <div><strong>Lead ID:</strong> {selectedLead._id}</div>
                    </div>
                  </div>
                </div>                {/* Anhänge */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                    <Paperclip className="h-4 w-4 text-brand-600" />
                    Anhänge
                  </h4>                  <div className="space-y-2 bg-neutral-50 p-4 rounded-lg border max-h-32 overflow-y-auto">
                    {editForm.attachments && editForm.attachments.length > 0 ? (
                      editForm.attachments.map((attachment) => (
                        <div key={attachment._id} className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="flex items-center gap-2">
                            <FileIcon className="h-4 w-4 text-brand-600" />
                            <span className="text-sm font-medium truncate">{attachment.originalName || attachment.filename}</span>
                            <span className="text-xs text-gray-500">
                              ({attachment.fileSize ? `${Math.round(attachment.fileSize / 1024)}KB` : 'Größe unbekannt'})
                            </span>                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenAttachment(attachment._id)}
                              disabled={downloadingFiles.has(attachment._id)}
                              className="text-brand-600 hover:text-brand-700 disabled:opacity-50 min-w-[80px]"
                            >
                              {downloadingFiles.has(attachment._id) ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-transparent border-t-brand-600"></div>
                                  Laden...
                                </div>
                              ) : (
                                'Öffnen'
                              )}
                            </Button>
                            {/* Only show delete button for admins */}
                            {currentUser?.role === 'admin' && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAttachment(attachment._id)}
                                disabled={deletingFiles.has(attachment._id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 min-w-[80px]"
                              >
                                {deletingFiles.has(attachment._id) ? (
                                  <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-transparent border-t-red-600"></div>
                                    <Trash2 className="h-3 w-3" />
                                  </div>
                                ) : (                                  <div className="flex items-center gap-1">
                                    <Trash2 className="h-3 w-3" />
                                    Löschen
                                  </div>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 italic text-center py-4">Noch keine Anhänge vorhanden</p>
                    )}
                  </div>
                  
                  {/* Moderner File Drop Bereich */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
                      isDragOver 
                        ? 'border-brand-400 bg-brand-50' 
                        : 'border-gray-300 hover:border-brand-300 hover:bg-gray-50'
                    }`}
                  >                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      disabled={isUploading}
                    />                    <div className="text-center">
                      {isUploading ? (
                        <div className="animate-pulse">
                          <Upload className="mx-auto h-12 w-12 mb-4 text-brand-500 animate-bounce" />
                          <p className="text-sm font-medium text-brand-600 mb-2">
                            Datei wird hochgeladen...
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className={`mx-auto h-12 w-12 mb-4 transition-colors ${
                            isDragOver ? 'text-brand-500' : 'text-gray-400'
                          }`} />
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            {isDragOver ? 'Datei hier ablegen' : 'Datei hochladen'}
                          </p>
                          <p className="text-xs text-gray-500 mb-4">
                            Ziehen Sie eine Datei hierher oder klicken Sie zum Auswählen
                          </p>
                        </>
                      )}
                        {/* Upload Progress Bar */}
                      {isUploading && (
                        <div className="mb-4 bg-white p-3 rounded-lg border shadow-sm">
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 relative overflow-hidden ${
                                uploadStatus === 'processing' 
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                                  : 'bg-gradient-to-r from-brand-500 to-brand-600'
                              }`}
                              style={{ width: `${uploadProgress}%` }}
                            >
                              {uploadStatus === 'processing' && (
                                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                              )}
                              {uploadStatus === 'uploading' && (
                                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm font-medium ${
                            uploadStatus === 'processing' ? 'text-orange-600' : 'text-brand-600'
                          }`}>
                            {uploadStatus === 'uploading' 
                              ? `${uploadProgress}% hochgeladen`
                              : uploadStatus === 'processing'
                              ? `${uploadProgress}% - Datei wird verarbeitet...`
                              : `${uploadProgress}% hochgeladen`
                            }
                          </p>
                        </div>
                      )}
                        <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="pointer-events-none"
                        disabled={isUploading}
                      >
                        <FileIcon className="h-4 w-4 mr-2" />
                        {isUploading 
                          ? uploadStatus === 'uploading' 
                            ? `${uploadProgress}% hochgeladen`
                            : uploadStatus === 'processing'
                            ? 'Verarbeitung...'
                            : `${uploadProgress}% hochgeladen`
                          : 'Datei auswählen'
                        }
                      </Button>
                      {!isUploading && (
                        <p className="text-xs text-gray-400 mt-2">
                          PDF, DOC, DOCX, TXT, JPG, PNG (max. 10MB)
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kommentare */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                    <MessageSquare className="h-4 w-4 text-brand-600" />
                    Kommentare
                  </h4>
                  <div className="space-y-3 bg-neutral-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
                    {editForm.communications && editForm.communications.length > 0 ? (
                      editForm.communications
                        .filter((comm) => comm.type === 'follow-up' && comm.subject === 'Kommentar')
                        .map((comment) => (
                        <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm border">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-semibold text-brand-600 text-sm">{comment.userId?.name || 'Unbekannt'}</span>
                            <span className="text-xs text-slate-400">{new Date(comment.date).toLocaleString('de-DE')}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 italic text-center py-8">Noch keine Kommentare vorhanden</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Neuen Kommentar hinzufügen..."
                      rows={3}
                      className="w-full resize-none"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-md transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Kommentar senden                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t mt-6">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="sm:w-auto h-11 px-6 font-semibold"
          >
            Abbrechen
          </Button>
          <Button 
            onClick={onSave}
            className="sm:w-auto h-11 px-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold"
          >
            Lead speichern
          </Button>
        </div>
      </div>
    </div>
  );
};
export default LeadEditModal;