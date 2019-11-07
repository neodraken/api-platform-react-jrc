<?php
/**
 * Created by IntelliJ IDEA.
 * User: johan
 * Date: 05/11/2019
 * Time: 10:03
 */

namespace App\Controller;


use App\Entity\Invoice;
use Doctrine\Common\Persistence\ObjectManager;

class InvoiceIncrementationController
{
    private $manager;


    public function __construct(ObjectManager $manager)
    {
        $this->manager = $manager;
    }

    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono()+1);

        $this->manager->flush($data);

        // TODO: Implement __invoke() method.
        return $data;
    }

}