-- CreateTable
CREATE TABLE "Report_Assessment" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "baseline_cost" DOUBLE PRECISION NOT NULL,
    "residual_cost" DOUBLE PRECISION NOT NULL,
    "implementation_cost" DOUBLE PRECISION NOT NULL,
    "is_critical_rule" BOOLEAN NOT NULL DEFAULT false,
    "cba_score" DOUBLE PRECISION NOT NULL,
    "priority_score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_Assessment_reportId_key" ON "Report_Assessment"("reportId");

-- AddForeignKey
ALTER TABLE "Report_Assessment" ADD CONSTRAINT "Report_Assessment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
