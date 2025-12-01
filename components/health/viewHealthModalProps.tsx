import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Heart, Thermometer, FileText } from "lucide-react";
import { useLocalization } from "@/context/LocalizationContext";

interface ViewHealthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: {
    id: string;
    animalId: string;
    animalName: string;
    checkupType: string;
    date: string;
    status: string;
    temperature?: string;
    notes?: string;
  } | null;
}

const ViewHealthModal = ({
  open,
  onOpenChange,
  record,
}: ViewHealthModalProps) => {
  if (!record) return null;

  const { t, locale, setLocale } = useLocalization();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-800";
      case "Sick":
        return "bg-red-100 text-red-800";
      case "Under Treatment":
        return "bg-yellow-100 text-yellow-800";
      case "Recovered":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            {t("health_record")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{t("record_id")}</p>
                  <p className="font-semibold">{record.id}</p>
                </div>
                <Badge className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-lg">🐄</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("reference_id")}</p>
                  <p className="font-semibold">
                    {record.animalName} ({record.animalId})
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("checkup_type")}</p>
                  <p className="font-semibold">{record.checkupType}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t("date")}</p>
                  <p className="font-semibold">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {record.temperature && (
              <Card>
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Thermometer className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t("temperature")}</p>
                    <p className="font-semibold">{record.temperature}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {record.notes && (
              <Card>
                <CardContent className="p-4 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{t("notes")}</p>
                    <p className="font-semibold">{record.notes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewHealthModal;
