import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Report, ReportStatus } from "@/types/types";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle } from "lucide-react";

interface DetailsCardProps {
  report: Report;
}

export default function DetailsCard({ report }: DetailsCardProps) {
  return (
    <Card className="inline-block w-full p-4 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl drop-shadow-2xl">
      {report.pictureUrl && (
        <img
          src={report.pictureUrl}
          alt="Report Image"
          className="w-full h-auto rounded-t-3xl"
        />
      )}
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-black">{report.emergencyType}</CardTitle>
          <CardDescription className="text-black">
            {report.location.address}
          </CardDescription>
        </div>
        <div>
          {report.status === ReportStatus.CLOSED ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <XCircle className="text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-black">{report.comments}</p>
      </CardContent>
      <CardFooter className="text-black flex items-center space-x-4 text-sm">
        <div>
          <p>
            <strong>Reporter:</strong>
          </p>
          <p>{report.reporterName}</p>
        </div>
        <Separator orientation="vertical" className="h-6 bg-gray-400" />
        <div>
          <p>
            <strong>Contact: </strong>
          </p>
          <p>{report.reporterPhone}</p>
        </div>
        <Separator orientation="vertical" className="h-6 bg-gray-400" />
        <div>
          <p>
            <strong>Time:</strong>{" "}
          </p>{" "}
          <p> {new Date(report.timeDate).toLocaleString()}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
