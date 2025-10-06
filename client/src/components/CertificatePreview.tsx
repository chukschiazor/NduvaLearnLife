import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award } from "lucide-react";

interface CertificatePreviewProps {
  courseName: string;
  studentName: string;
  completionDate: string;
}

export default function CertificatePreview({
  courseName,
  studentName,
  completionDate,
}: CertificatePreviewProps) {
  const handleDownload = () => {
    console.log('Certificate downloaded');
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10 p-12">
          <div className="border-4 border-primary/20 rounded-lg p-8 bg-background/80 backdrop-blur">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-warning to-chart-2 flex items-center justify-center">
                <Award className="h-10 w-10 text-white" />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground">
                  Certificate of Completion
                </h3>
                <h2 className="font-display font-bold text-3xl" data-testid="text-certificate-name">
                  {studentName}
                </h2>
              </div>

              <p className="text-muted-foreground max-w-md mx-auto">
                Has successfully completed the course
              </p>

              <h3 className="font-display font-semibold text-2xl text-primary" data-testid="text-certificate-course">
                {courseName}
              </h3>

              <div className="pt-4">
                <p className="text-sm text-muted-foreground">
                  Completed on {completionDate}
                </p>
              </div>

              <div className="pt-6">
                <div className="w-32 h-px bg-foreground/20 mx-auto" />
                <p className="text-xs text-muted-foreground mt-2">NDUVA Learning Platform</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted/50">
          <Button className="w-full gap-2" onClick={handleDownload} data-testid="button-download-certificate">
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
