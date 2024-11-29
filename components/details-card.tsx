import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Report, ReportStatus } from "@/types/Report";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface DetailsCardProps {
  report: Report;
}

export default function DetailsCard({ report }: DetailsCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    setIsVisible(true);
  }, [report]);

  return (
    <>
      {isVisible ? (
        <Card className="inline-block w-full p-4 bg-white bg-opacity-30 backdrop-blur-md border border-white border-opacity-70 rounded-3xl drop-shadow-3xl">
          {report.pictureUrl && (
            <AspectRatio ratio={16 / 9} className="rounded-t-3xl">
              <img
                src={report.pictureUrl}
                alt="Report Image"
                className="w-full h-full object-cover rounded-t-3xl"
              />
            </AspectRatio>
          )}
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-black">
                {report.emergencyType}
              </CardTitle>
              <CardDescription className="text-black">
                {report.location.address}
              </CardDescription>
            </div>
            <div>
              <div
                className={`ml-6 mb-8 px-4 py-2 text-black text-opacity-70 ${
                  report.status === ReportStatus.OPEN
                    ? "bg-green-600"
                    : "bg-red-400"
                } bg-opacity-20 border border-white rounded-3xl drop-shadow-2xl`}
              >
                {report.status.toString()}
              </div>
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
          <button
            onClick={toggleVisibility}
            className="ml-4 mb-4 px-4 py-2 text-black text-opacity-70 bg-white bg-opacity-20 border border-white rounded-3xl drop-shadow-2xl"
          >
            Hide Details
          </button>
        </Card>
      ) : (
        <button
          onClick={toggleVisibility}
          className="ml-6 mb-8 px-4 py-2 text-black text-opacity-70 bg-white bg-opacity-70 border border-white rounded-3xl drop-shadow-2xl"
        >
          <strong>Show Details</strong>
        </button>
      )}
    </>
  );
}
