import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Editor from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { useState } from 'react';

export const MarkdownConverter = () => {
  const [markdown, setMarkdown] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!markdown.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira algum conteúdo Markdown",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/convert/txt', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: markdown, 
      });

      if (!response.ok) {
        throw new Error('Erro na conversão');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      
      toast({
        title: "Sucesso!",
        description: "PDF gerado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível converter o arquivo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Markdown para PDF</h1>
          <Button 
            onClick={handleConvert}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Convertendo
              </>
            ) : (
              'Converter'
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 max-w-screen-xl mx-auto w-full">
        <div className="h-full min-h-[500px] rounded-lg border bg-background shadow-sm">
          <Editor
            height="100%"
            defaultLanguage="markdown"
            theme="vs-light"
            value={markdown}
            onChange={(value) => setMarkdown(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              padding: { top: 16 },
            }}
          />
        </div>
        <div className="h-full min-h-[500px] rounded-lg border bg-background shadow-sm">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-lg"
              title="PDF Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              O PDF será exibido aqui após a conversão
            </div>
          )}
        </div>
      </main>
    </div>
  );
};