import {
  Body,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import {
  GeneralResponse,
  GeneralResponseErrorDetail,
  ResponseCode,
} from 'src/common-module/dto/general-response.dto';
import { DataTableFilter } from 'src/common-module/dto/data-table-filter.dto';
import { plainToClass } from 'class-transformer';
import { DataTableResponse } from 'src/common-module/dto/data-table-response.dto';
import { UserDetail } from 'src/common-module/dto/user/user.dto';
import { FormField } from 'src/common-module/dto/form/form-field.dto';
import { Validator } from 'src/common-module/utils/validator/validator';

export abstract class BaseEntityController {
  /**
   * Các field không trả về qua API
   */
  __getExcludeKeys: string[] = [
    'createdBy',
    'updatedBy',
    'updatedAt',
    'deleted',
    'deletedAt',
    'deletedBy',
    'log',
    'fieldsToSign',
    'sign',
  ];

  /**
   * Các field không thể cập nhật bằng API
   */
  __updateExcludeFields: string[] = [
    'id',
    'uuid',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deleted',
    'deletedAt',
    'deletedBy',
    'version',
    'log',
    'fieldsToSign',
    'sign',
  ];

  /**
   * Ràng buộc khi update object
   */
  __updateDtoContraints: FormField[] = [];

  /**
   * Các field không thể cập nhật khi thêm mới bằng API
   */
  __createExcludeFields: string[] = [
    'id',
    'uuid',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt',
    'deleted',
    'deletedAt',
    'deletedBy',
    'version',
    'log',
    'fieldsToSign',
    'sign',
  ];

  /**
   * Ràng buộc khi create object
   */
  __createDtoContraints: FormField[] = [];

  constructor(public entityService: BaseEntityService) {}

  // ====================== LIST ======================
  @Get()
  async index(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const items = await this.entityService.list();
      return items.map((item: any) =>
        this.entityService.modifyData(item, this.__getExcludeKeys),
      );
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return GeneralResponse.getInstance(
        GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR,
        { message: e.message },
      );
    }
  }

  // ====================== GET BY ID ======================
  @Get(':id')
  async get(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const item = await this.entityService.get(id);
      if (!item) {
        res.status(HttpStatus.NOT_FOUND);
        return GeneralResponse.getInstance(
          GeneralResponseErrorDetail.NOT_FOUND_ERROR,
        );
      }
      return this.entityService.modifyData(item, this.__getExcludeKeys);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return GeneralResponse.getInstance(
        GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR,
        { message: e.message },
      );
    }
  }

  // ====================== HOOKS ======================
  async onBeforeSave(item: any): Promise<GeneralResponse> {
    return Validator.validate(this.__createDtoContraints, item);
  }

  onAfterSave(item?: any) {}

  async onBeforeUpdate(item: any): Promise<GeneralResponse> {
    return Validator.validate(this.__updateDtoContraints, item);
  }

  onAfterUpdate() {}

  onAfterDelete() {}

  // ====================== CREATE ======================
  @Post()
  async save(
    @Body() body: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    body = this.entityService.modifyData(body, this.__createExcludeFields);

    const user: UserDetail = req['userDetail'];
    if (user) {
      body.createdBy = user.username;
    }

    const gr = await this.onBeforeSave(body);
    if (gr.code !== ResponseCode.SUCCESS) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return gr;
    }

    try {
      const item = await this.entityService.save(body);
      if (!item) {
        res.status(HttpStatus.NOT_FOUND);
        return GeneralResponse.getInstance(
          GeneralResponseErrorDetail.NOT_FOUND_ERROR,
        );
      }
      this.onAfterSave(item);
      return this.entityService.modifyData(item, this.__getExcludeKeys);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return GeneralResponse.getInstance(
        GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR,
        { message: e.message },
      );
    }
  }

  // ====================== UPDATE ======================
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    body = this.entityService.modifyData(body, this.__updateExcludeFields);

    const user: UserDetail = req['userDetail'];
    if (user) {
      body.updatedBy = user.username;
    }

    const gr = await this.onBeforeUpdate(body);
    if (gr.code !== ResponseCode.SUCCESS) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return gr;
    }

    try {
      const item = await this.entityService.update(id, body);
      if (!item) {
        res.status(HttpStatus.NOT_FOUND);
        return GeneralResponse.getInstance(
          GeneralResponseErrorDetail.NOT_FOUND_ERROR,
        );
      }
      this.onAfterUpdate();
      return this.entityService.modifyData(item, this.__getExcludeKeys);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return GeneralResponse.getInstance(
        GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR,
        { message: e.message },
      );
    }
  }

  // ====================== DELETE ======================
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    try {
      const item = await this.entityService.delete(id);
      if (!item) {
        res.status(HttpStatus.NOT_FOUND);
        return GeneralResponse.getInstance(
          GeneralResponseErrorDetail.NOT_FOUND_ERROR,
        );
      }
      this.onAfterDelete();
      return this.entityService.modifyData(item, this.__getExcludeKeys);
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return GeneralResponse.getInstance(
        GeneralResponseErrorDetail.INTERNAL_SERVER_ERROR,
        { message: e.message },
      );
    }
  }

  // ====================== DATATABLE ======================
  @Get(['load-data-table', 'loadDataTable'])
  async loadDataTable(
    @Req() request: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    if (request.query.filters) {
      request.query.filters = JSON.parse(request.query.filters.toString());
    }

    const dataTableFilter = plainToClass(DataTableFilter, request.query, {
      enableImplicitConversion: true,
    });

    const loadMethod =
      request.query['mt'] === 'qb'
        ? this.entityService.loadDataTableUsingQueryBuilder(dataTableFilter)
        : this.entityService.loadDataTable(dataTableFilter);

    try {
      const [items, total] = await loadMethod;
      const response = new DataTableResponse();
      response.first = dataTableFilter.first;
      response.rows = dataTableFilter.rows;
      response.totalRows = total;
      response.items = items.map((item: any) =>
        this.entityService.modifyData(item, this.__getExcludeKeys),
      );
      return response;
    } catch (e) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return GeneralResponse.getInstance(
        GeneralResponseErrorDetail.EXECEPTION_ERROR,
        { message: e.message },
      );
    }
  }

  // ====================== CHECK SIGN ======================
  @Get(':id/check-sign')
  async checkSign(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const item = (await this.entityService.get(id)) as any;
    return item?.isValidSign?.();
  }
}
